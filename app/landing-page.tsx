"use client";

import Link from "next/link";
import ViaViaLogo from "./components/ViaViaLogo";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-[#1C1C1E] px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <ViaViaLogo size="sm" />
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          <button className="text-sm text-[#34C759] hover:opacity-80 transition-opacity">
            {isLoggedIn ? "Dashboard" : "Inloggen"}
          </button>
        </Link>
      </div>

      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
          Freelance opdrachten delen,
          <br />
          zonder WhatsApp-scrollen
        </h1>
        <p className="text-[#8E8E93] mb-8">
          Eén plek voor alle opdrachten uit je netwerk
        </p>
        <div className="flex flex-col gap-3">
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <button className="w-full bg-[#34C759] hover:bg-[#2DB84E] text-white font-semibold rounded-2xl py-4 text-lg transition-colors">
              Start gratis
            </button>
          </Link>
          <Link href="/download">
            <button className="w-full bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-medium rounded-2xl py-4 transition-colors">
              Installeer app
            </button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Hoe werkt het?
        </h2>
        <div className="space-y-3">
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Maak een groep</h3>
                <p className="text-[#8E8E93] text-sm">
                  Koppel aan je WhatsApp-groep
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Deel opdrachten</h3>
                <p className="text-[#8E8E93] text-sm">
                  Plaats en bekijk opdrachten
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Reageer via WhatsApp</h3>
                <p className="text-[#8E8E93] text-sm">
                  Direct contact, geen omwegen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install block */}
      <section className="mb-10">
        <div className="bg-[#2C2C2E] rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-2 text-center">
            Installeer de app
          </h3>
          <p className="text-[#8E8E93] text-sm text-center mb-4">
            Voeg ViaVia toe aan je homescreen
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1C1C1E] rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🤖</div>
              <p className="text-white text-sm font-medium">Android</p>
              <p className="text-[#636366] text-xs">Tik op installeren</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🍎</div>
              <p className="text-white text-sm font-medium">iPhone</p>
              <p className="text-[#636366] text-xs">Deel → Homescreen</p>
            </div>
          </div>
          <Link href="/download" className="block mt-4">
            <button className="w-full bg-[#3A3A3C] hover:bg-[#48484A] text-white font-medium rounded-xl py-3 text-sm transition-colors">
              Bekijk instructies
            </button>
          </Link>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Veelgestelde vragen
        </h2>
        <div className="space-y-3">
          <details className="bg-[#2C2C2E] rounded-2xl group">
            <summary className="p-4 cursor-pointer text-white font-medium list-none flex justify-between items-center">
              Is het gratis?
              <span className="text-[#636366] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="px-4 pb-4 text-[#8E8E93] text-sm">
              Ja, ViaVia is volledig gratis te gebruiken.
            </p>
          </details>
          <details className="bg-[#2C2C2E] rounded-2xl group">
            <summary className="p-4 cursor-pointer text-white font-medium list-none flex justify-between items-center">
              Wie kan mijn opdrachten zien?
              <span className="text-[#636366] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="px-4 pb-4 text-[#8E8E93] text-sm">
              Alleen mensen in je groep kunnen opdrachten zien die je daar deelt.
            </p>
          </details>
          <details className="bg-[#2C2C2E] rounded-2xl group">
            <summary className="p-4 cursor-pointer text-white font-medium list-none flex justify-between items-center">
              Hoe reageer ik op een opdracht?
              <span className="text-[#636366] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="px-4 pb-4 text-[#8E8E93] text-sm">
              Tik op &quot;Reageer via WhatsApp&quot; om direct contact te leggen.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-[#636366] text-xs pb-8">
        <p>
          ViaVia is{" "}
          <a
            href="https://github.com/drprijkers-del/viavia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#34C759] hover:underline"
          >
            open source
          </a>
        </p>
      </footer>
    </div>
  );
}
