"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

type LoginState = "idle" | "loading" | "success" | "error";

function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setState("loading");
    setSubmittedEmail(email);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setState("error");
        setErrorMessage("Er ging iets mis. Controleer je email en probeer opnieuw.");
      } else {
        setState("success");
      }
    } catch (err) {
      console.error("Login error:", err);
      setState("error");
      setErrorMessage("Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  async function handleResend() {
    setState("loading");
    setErrorMessage("");

    try {
      const result = await signIn("resend", {
        email: submittedEmail,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setState("error");
        setErrorMessage("Kon email niet opnieuw versturen. Probeer het later.");
      } else {
        setState("success");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setState("error");
      setErrorMessage("Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  if (state === "success") {
    return (
      <div className="card w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Check je email</h1>
          <p className="text-muted text-sm mb-2">
            We hebben een inloglink gestuurd naar
          </p>
          <p className="font-semibold text-accent">{submittedEmail}</p>
        </div>

        <div className="bg-bg rounded-xl p-4 mb-6">
          <p className="text-muted text-sm text-center">
            Klik op de link in de email om in te loggen.
            <br />
            <span className="text-tertiary">Geen email? Check je spam folder.</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleResend}
            className="btn btn-secondary w-full"
          >
            Opnieuw versturen
          </button>
          <button
            onClick={() => {
              setState("idle");
              setEmail("");
              setSubmittedEmail("");
            }}
            className="text-accent text-sm hover:opacity-80 transition-opacity py-2"
          >
            Wijzig emailadres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">Inloggen</h1>
        <p className="text-muted text-sm">
          Geen wachtwoord nodig. We sturen een veilige inloglink.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">
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
            className="input"
            disabled={state === "loading"}
          />
        </div>

        {state === "error" && errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={state === "loading" || !email}
          className="btn btn-primary w-full"
        >
          {state === "loading" ? (
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

      <p className="text-tertiary text-xs text-center mt-6">
        Nog geen account? Geen probleem — we maken er automatisch een aan.
      </p>
    </div>
  );
}

function LoginFormShell() {
  return (
    <div className="card w-full">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">Inloggen</h1>
        <p className="text-muted text-sm">
          Geen wachtwoord nodig. We sturen een veilige inloglink.
        </p>
      </div>
      <div>
        <label className="block text-sm text-muted mb-1.5">Email</label>
        <input
          type="email"
          placeholder="je@email.nl"
          className="input"
          disabled
        />
      </div>
      <button
        disabled
        className="btn btn-primary w-full mt-4 opacity-50"
      >
        Verstuur inloglink
      </button>
    </div>
  );
}

function LoginWithParams() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  // Show loading while checking session
  if (status === "loading") {
    return <LoginFormShell />;
  }

  // Show form if not logged in
  if (status === "unauthenticated") {
    return <LoginForm callbackUrl={callbackUrl} />;
  }

  // Session exists, will redirect
  return (
    <div className="card w-full text-center">
      <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-muted">Je wordt doorgestuurd...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="app-frame flex flex-col items-center justify-center" style={{ minHeight: "100vh" }}>
      <Link href="/" className="mb-8">
        <ViaViaLogo size="md" />
      </Link>

      <div className="w-full max-w-sm">
        <Suspense fallback={<LoginFormShell />}>
          <LoginWithParams />
        </Suspense>
      </div>

      <Link href="/" className="mt-6 text-muted text-sm hover:text-white transition-colors">
        ← Terug naar home
      </Link>
    </div>
  );
}
