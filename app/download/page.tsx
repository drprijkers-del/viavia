"use client";

import Link from "next/link";
import ViaViaLogo from "../components/ViaViaLogo";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function DownloadPage() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://viavia76.vercel.app";

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      alert("Installeren niet beschikbaar. Gebruik het browsermenu of volg de instructies hieronder.");
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  return (
    <div className="app-frame hero-gradient">
      <div className="app-container-full pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 mt-6 animate-fade-in">
          <ViaViaLogo size="sm" href="/" />
          <Link href="/">
            <button className="text-sm text-secondary hover:text-white transition-colors">
              ← Terug
            </button>
          </Link>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 animate-slide-up">
            <span className="inline-block glass-accent rounded-full px-4 py-2 text-sm text-accent mb-4">
              Progressive Web App
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Download <span className="gradient-text">ViaVia</span>
            </h1>
            <p className="text-secondary text-lg max-w-lg mx-auto">
              Installeer ViaVia als app op je apparaat voor de beste ervaring
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* QR Code */}
            <div className="card card-gradient text-center p-8 animate-slide-in-left">
              <h2 className="text-xl font-semibold text-white mb-6">Scan met je telefoon</h2>
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg shadow-white/10">
                <QRCodeSVG
                  value={appUrl}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-tertiary mt-6">
                Open deze link op je telefoon om ViaVia te installeren
              </p>
            </div>

            {/* Install Buttons */}
            <div className="card card-gradient p-8 animate-slide-in-right">
              <h2 className="text-xl font-semibold text-white mb-6">Of installeer direct</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleInstall}
                  className="btn btn-primary btn-glow py-4 text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Installeer ViaVia
                </button>
                <Link href="/dashboard">
                  <button className="btn btn-secondary py-4 text-lg w-full">
                    Open in browser
                  </button>
                </Link>
              </div>
              <div className="glass rounded-xl p-4 mt-6">
                <p className="text-sm text-tertiary text-center">
                  ViaVia werkt als een echte app, zonder App Store download
                </p>
              </div>
            </div>
          </div>

          {/* Platform Instructions */}
          <h2 className="text-2xl font-bold text-white text-center mb-8 animate-slide-up">
            Handmatige installatie
          </h2>
          <div className="desktop-grid-2 stagger-animate">
            <div className="card card-gradient card-hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <h3 className="text-white font-semibold">iOS</h3>
                  <p className="text-xs text-tertiary">iPhone & iPad</p>
                </div>
              </div>
              <ol className="text-sm text-secondary space-y-3 list-decimal list-inside">
                <li>Open ViaVia in <strong className="text-white">Safari</strong></li>
                <li>Tik op het <strong className="text-white">Deel</strong>-icoon (⬆️) onderaan</li>
                <li>Scroll en tik op <strong className="text-white">&apos;Zet op beginscherm&apos;</strong></li>
                <li>Tik op <strong className="text-white">&apos;Voeg toe&apos;</strong></li>
              </ol>
            </div>

            <div className="card card-gradient card-hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-white font-semibold">Android</h3>
                  <p className="text-xs text-tertiary">Telefoons & tablets</p>
                </div>
              </div>
              <ol className="text-sm text-secondary space-y-3 list-decimal list-inside">
                <li>Open ViaVia in <strong className="text-white">Chrome</strong></li>
                <li>Tik op het <strong className="text-white">menu</strong> (⋮) rechtsboven</li>
                <li>Tik op <strong className="text-white">&apos;App installeren&apos;</strong></li>
                <li>Tik op <strong className="text-white">&apos;Installeren&apos;</strong></li>
              </ol>
            </div>
          </div>

          {/* Info card */}
          <div className="card card-accent mt-12 text-center p-8 animate-slide-up">
            <div className="w-16 h-16 mx-auto rounded-full gradient-accent flex items-center justify-center text-3xl mb-4 animate-float">
              ✨
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Werkt als een echte app</h3>
            <p className="text-secondary max-w-md mx-auto">
              Na installatie vind je ViaVia op je startscherm. Open de app met één tik en geniet van de volledige ervaring, ook offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
