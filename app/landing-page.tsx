"use client";

import Link from "next/link";
import ViaViaLogo from "./components/ViaViaLogo";
import { useSession } from "next-auth/react";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

export default function LandingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <div className="app-frame">
        <div className="app-container pb-24">
          {/* Header */}
          <div className="flex items-center justify-between py-6">
            <ViaViaLogo size="md" href="/" />
            <Link href={isLoggedIn ? "/app" : "/login"}>
              <button className="text-sm text-accent hover:opacity-80">
                {isLoggedIn ? "Dashboard" : "Inloggen"}
              </button>
            </Link>
          </div>

          {/* Hero */}
          <div className="text-center max-w-2xl mx-auto mb-16 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Freelance opdrachten, zonder WhatsApp-scrollen
            </h1>
            <p className="text-lg text-secondary mb-8">
              Alle via-via opdrachten uit je WhatsApp-groepen op één overzichtelijke plek
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isLoggedIn ? "/app" : "/login"}>
                <button className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                  Start
                </button>
              </Link>
              <a href="#download">
                <button className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
                  Installeer app
                </button>
              </a>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Hoe werkt het?
            </h2>
            <div className="card space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                  1
                </div>
                <p className="text-secondary pt-1">Maak een groepsoverzicht en deel de link in WhatsApp</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                  2
                </div>
                <p className="text-secondary pt-1">Groepsleden plaatsen opdrachten via ViaVia</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                  3
                </div>
                <p className="text-secondary pt-1">Reageren met één tap rechtstreeks via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Install Section */}
          <div id="download" className="max-w-2xl mx-auto mb-16">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Installeer ViaVia
              </h2>
              <p className="text-secondary mb-6">
                Gebruik ViaVia als app op je telefoon
              </p>

              <div className="flex flex-col gap-3 mb-6">
                <Link href="/download">
                  <button className="btn btn-primary w-full py-4">
                    Installeer ViaVia
                  </button>
                </Link>
                <Link href={isLoggedIn ? "/app" : "/login"}>
                  <button className="btn btn-secondary w-full py-4">
                    {isLoggedIn ? "Open app" : "Inloggen"}
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-[#2C2C2E] rounded-xl p-4">
                  <div className="text-2xl mb-2">📱</div>
                  <h3 className="text-white font-semibold text-sm mb-1">iOS</h3>
                  <p className="text-xs text-tertiary">
                    Safari → Deel → Zet op beginscherm
                  </p>
                </div>
                <div className="bg-[#2C2C2E] rounded-xl p-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <h3 className="text-white font-semibold text-sm mb-1">Android</h3>
                  <p className="text-xs text-tertiary">
                    Chrome → Menu → Installeren
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Veelgestelde vragen
            </h2>
            <div className="space-y-3">
              <div className="card">
                <h3 className="text-white font-semibold mb-2 text-sm">
                  Moet iedereen een account maken?
                </h3>
                <p className="text-secondary text-sm">
                  Nee. Opdrachten lezen kan zonder account. Voor beheren en plaatsen heb je wel een account nodig.
                </p>
              </div>
              <div className="card">
                <h3 className="text-white font-semibold mb-2 text-sm">
                  Is ViaVia gekoppeld aan WhatsApp?
                </h3>
                <p className="text-secondary text-sm">
                  Nee. ViaVia leest geen WhatsApp-berichten. Het biedt alleen overzicht.
                </p>
              </div>
              <div className="card">
                <h3 className="text-white font-semibold mb-2 text-sm">
                  Wie ziet mijn opdrachten?
                </h3>
                <p className="text-secondary text-sm">
                  Alleen mensen met de groepslink. Opdrachten zijn niet openbaar.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-[#48484A] text-center">
            <div className="flex justify-center gap-6 text-sm text-tertiary mb-3">
              <a href="https://github.com/viavia-app" className="hover:text-white transition-colors">Open source</a>
              <a href="mailto:contact@viavia.app" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-tertiary">
              © 2026 ViaVia
            </p>
          </div>
        </div>
      </div>
      <PWAInstallPrompt />
    </>
  );
}
