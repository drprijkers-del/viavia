"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn("resend", { email, redirect: false });
      setSent(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="app-frame hero-gradient">
        <div className="app-container-wide">
          <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <div className="animate-bounce-in">
              <ViaViaLogo size="lg" href="/" />
            </div>
            <div className="card card-gradient max-w-md w-full mt-8 animate-scale-in">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-full gradient-accent flex items-center justify-center text-3xl mb-4 animate-bounce-in">
                  ✉️
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Check je email</h1>
              </div>
              <p className="text-secondary mb-4 text-center">
                We hebben een inloglink gestuurd naar{" "}
                <strong className="text-accent">{email}</strong>
              </p>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-tertiary">
                  Klik op de link in de email om in te loggen. Je kunt dit venster sluiten.
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-secondary hover:text-white transition-colors"
                >
                  Andere email gebruiken
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame hero-gradient">
      <div className="app-container-wide">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="animate-slide-down">
            <ViaViaLogo size="lg" href="/" />
          </div>
          <div className="card card-gradient max-w-md w-full mt-8 animate-slide-up">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Welkom terug</h1>
              <p className="text-secondary">
                Vul je email in om een inloglink te ontvangen
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.nl"
                  required
                  className="input"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-glow w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Bezig...
                  </span>
                ) : (
                  "Verstuur inloglink"
                )}
              </button>
            </form>
            <div className="divider my-6"></div>
            <div className="text-center">
              <p className="text-sm text-tertiary mb-2">Nog geen account?</p>
              <p className="text-sm text-secondary">
                Je krijgt automatisch een account als je inlogt
              </p>
            </div>
          </div>
          <div className="mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link href="/" className="text-sm text-tertiary hover:text-white transition-colors">
              ← Terug naar home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
