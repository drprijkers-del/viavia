"use client";

import Link from "next/link";
import ViaViaLogo from "./components/ViaViaLogo";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <ViaViaLogo size="sm" />
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          <button className="text-sm text-accent hover:opacity-80 transition-opacity">
            {isLoggedIn ? "Dashboard" : "Inloggen"}
          </button>
        </Link>
      </div>

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3 leading-tight">
          Freelance opdrachten delen,
          <br />
          zonder WhatsApp-scrollen
        </h1>
        <p className="text-muted mb-8">
          Eén plek voor alle opdrachten uit je netwerk
        </p>
        <div className="flex flex-col gap-3">
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <button className="btn btn-primary w-full text-lg py-4">
              Start gratis
            </button>
          </Link>
          <Link href="/download">
            <button className="btn btn-secondary w-full py-4">
              Installeer app
            </button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Hoe werkt het?
        </h2>
        <div className="space-y-3">
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Maak een groep</h3>
                <p className="text-muted text-sm">
                  Koppel aan je WhatsApp-groep
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">Deel opdrachten</h3>
                <p className="text-muted text-sm">
                  Plaats en bekijk opdrachten
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Reageer via WhatsApp</h3>
                <p className="text-muted text-sm">
                  Direct contact, geen omwegen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install block */}
      <section className="mb-12">
        <div className="card">
          <h3 className="font-semibold mb-2 text-center">
            Installeer de app
          </h3>
          <p className="text-muted text-sm text-center mb-4">
            Voeg ViaVia toe aan je homescreen
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🤖</div>
              <p className="text-sm font-medium">Android</p>
              <p className="text-tertiary text-xs">Tik op installeren</p>
            </div>
            <div className="bg-bg rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🍎</div>
              <p className="text-sm font-medium">iPhone</p>
              <p className="text-tertiary text-xs">Deel → Homescreen</p>
            </div>
          </div>
          <Link href="/download" className="block mt-4">
            <button className="btn btn-secondary w-full text-sm">
              Bekijk instructies
            </button>
          </Link>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Veelgestelde vragen
        </h2>
        <div className="space-y-3">
          <details className="card group">
            <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
              Is het gratis?
              <span className="text-tertiary group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-muted text-sm">
              Ja, ViaVia is volledig gratis te gebruiken.
            </p>
          </details>
          <details className="card group">
            <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
              Wie kan mijn opdrachten zien?
              <span className="text-tertiary group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-muted text-sm">
              Alleen mensen in je groep kunnen opdrachten zien die je daar
              deelt.
            </p>
          </details>
          <details className="card group">
            <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
              Hoe reageer ik op een opdracht?
              <span className="text-tertiary group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-muted text-sm">
              Tik op &quot;Reageer via WhatsApp&quot; om direct contact te leggen.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-tertiary text-xs pb-8">
        <p>
          ViaVia is{" "}
          <a
            href="https://github.com/drprijkers-del/viavia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            open source
          </a>
        </p>
      </footer>
    </div>
  );
}
