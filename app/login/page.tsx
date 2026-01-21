"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError("Er ging iets mis. Controleer je email en probeer opnieuw.");
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-[#2C2C2E] max-w-sm w-full">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#34C759]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Check je email</h1>
          <p className="text-[#8E8E93] text-sm mb-4">
            We hebben een inloglink gestuurd naar
          </p>
          <p className="text-white font-medium mb-4">{email}</p>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl p-4 mb-4">
          <p className="text-[#8E8E93] text-sm text-center">
            Klik op de link in de email om in te loggen. Geen email? Check je spam folder.
          </p>
        </div>

        <button
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="w-full text-[#34C759] text-sm hover:opacity-80 transition-opacity"
        >
          Ander emailadres gebruiken
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-[#2C2C2E] max-w-sm w-full">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-2">Inloggen of registreren</h1>
        <p className="text-[#8E8E93] text-sm">
          Vul je email in. We sturen je een inloglink.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-[#8E8E93] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@email.nl"
            required
            autoFocus
            autoComplete="email"
            className="w-full bg-[#0A0A0A] border border-[#3A3A3C] rounded-xl px-4 py-3 text-white placeholder-[#636366] focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-colors"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl p-3">
            <p className="text-[#FF453A] text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-[#34C759] hover:bg-[#2DB84E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-full py-3.5 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Versturen...
            </span>
          ) : (
            "Verstuur inloglink"
          )}
        </button>
      </form>

      <p className="text-[#636366] text-xs text-center mt-6">
        Nog geen account? Geen probleem — we maken er automatisch een aan.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-[#2C2C2E] max-w-sm w-full">
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-8 w-8 text-[#34C759]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <Link href="/" className="mb-8">
          <ViaViaLogo size="md" />
        </Link>

        <Suspense fallback={<LoadingState />}>
          <LoginForm />
        </Suspense>

        <Link href="/" className="mt-6 text-[#636366] text-sm hover:text-white transition-colors">
          ← Terug naar home
        </Link>
      </div>
    </div>
  );
}
