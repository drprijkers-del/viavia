"use client";

import Link from "next/link";
import ViaViaLogo from "../components/ViaViaLogo";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function DownloadPage() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://viavia76.vercel.app";

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  if (isStandalone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Al geïnstalleerd!</h1>
          <p className="text-muted mb-6">ViaVia draait als app op je apparaat.</p>
          <Link href="/dashboard">
            <button className="btn btn-primary">
              Open Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ViaViaLogo size="sm" />
        <Link href="/">
          <button className="text-sm text-muted hover:text-white transition-colors">
            ← Home
          </button>
        </Link>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Installeer ViaVia
        </h1>
        <p className="text-muted text-sm">
          Voeg toe aan je homescreen voor de beste ervaring
        </p>
      </div>

      {/* Android Install Button */}
      {installPrompt && (
        <button
          onClick={handleInstall}
          className="btn btn-primary w-full text-lg mb-6"
        >
          Installeer nu
        </button>
      )}

      {/* iOS Instructions */}
      {isIOS && !installPrompt && (
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🍎</span>
            <h2 className="font-semibold">iPhone / iPad</h2>
          </div>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">1</span>
              <span className="text-muted text-sm pt-0.5">Tik op <strong className="text-white">Deel</strong> (⬆️) onderaan</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">2</span>
              <span className="text-muted text-sm pt-0.5">Scroll en tik op <strong className="text-white">Zet op beginscherm</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">3</span>
              <span className="text-muted text-sm pt-0.5">Tik op <strong className="text-white">Voeg toe</strong></span>
            </li>
          </ol>
        </div>
      )}

      {/* Android Instructions (if no prompt) */}
      {isAndroid && !installPrompt && (
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤖</span>
            <h2 className="font-semibold">Android</h2>
          </div>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">1</span>
              <span className="text-muted text-sm pt-0.5">Tik op het <strong className="text-white">menu</strong> (⋮) rechtsboven</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">2</span>
              <span className="text-muted text-sm pt-0.5">Tik op <strong className="text-white">App installeren</strong></span>
            </li>
          </ol>
        </div>
      )}

      {/* Desktop: QR Code */}
      {!isIOS && !isAndroid && (
        <div className="card mb-6 text-center">
          <p className="text-muted text-sm mb-4">Scan met je telefoon</p>
          <div className="inline-block p-4 bg-white rounded-xl">
            <QRCodeSVG
              value={appUrl}
              size={160}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
      )}

      {/* Both platform instructions for desktop */}
      {!isIOS && !isAndroid && (
        <div className="space-y-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍎</span>
              <div>
                <h3 className="font-medium text-sm">iPhone / iPad</h3>
                <p className="text-tertiary text-xs">Safari → Deel → Zet op beginscherm</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-medium text-sm">Android</h3>
                <p className="text-tertiary text-xs">Chrome → Menu → App installeren</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue to app */}
      <Link href="/dashboard" className="block">
        <button className="btn btn-secondary w-full">
          Ga verder in browser
        </button>
      </Link>
    </div>
  );
}
