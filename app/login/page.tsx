"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import ViaViaLogo from "@/app/components/ViaViaLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard"
      });
      console.log("SignIn result:", result);
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
      <div className="app-frame">
        <div className="app-container">
          <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <ViaViaLogo size="lg" href="/" />
            <div className="card max-w-md w-full mt-8">
              <h1 className="text-2xl font-bold text-white mb-3">Check je email</h1>
              <p className="text-secondary mb-4">
                We hebben een inloglink gestuurd naar <strong className="text-white">{email}</strong>
              </p>
              <p className="text-sm text-tertiary">
                Klik op de link in de email om in te loggen. Je kunt dit venster sluiten.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <div className="app-container">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <ViaViaLogo size="lg" href="/" />
          <div className="card max-w-md w-full mt-8">
            <h1 className="text-2xl font-bold text-white mb-2">Inloggen</h1>
            <p className="text-secondary mb-6">
              Vul je email in om een inloglink te ontvangen
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.nl"
                required
                className="input mb-4"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? "Bezig..." : "Verstuur inloglink"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
