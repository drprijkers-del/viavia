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
      alert("Gebruik het browsermenu of volg de instructies hieronder om te installeren.");
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" />
          <Link href="/">
            <button className="text-sm text-secondary hover:text-white transition-colors">
              ← Home
            </button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Installeer ViaVia
            </h1>
            <p className="text-secondary">
              Gebruik ViaVia als app op je telefoon
            </p>
          </div>

          {/* QR Code */}
          <div className="card text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={appUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-tertiary mt-4">
              Scan met je telefoon
            </p>
          </div>

          {/* Install Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleInstall}
              className="btn btn-primary py-4 text-lg"
            >
              Installeer ViaVia
            </button>
            <Link href="/app">
              <button className="btn btn-secondary py-4 text-lg w-full">
                Open app
              </button>
            </Link>
          </div>

          {/* Platform Instructions */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                iOS (iPhone/iPad)
              </h2>
              <ol className="text-sm text-secondary space-y-2 list-decimal list-inside">
                <li>Open ViaVia in <strong>Safari</strong></li>
                <li>Tik op <strong>Deel</strong> (⬆️)</li>
                <li>Kies <strong>&apos;Zet op beginscherm&apos;</strong></li>
                <li>Tik op <strong>&apos;Voeg toe&apos;</strong></li>
              </ol>
            </div>

            <div className="card">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                Android
              </h2>
              <ol className="text-sm text-secondary space-y-2 list-decimal list-inside">
                <li>Open ViaVia in <strong>Chrome</strong></li>
                <li>Tik op het <strong>menu</strong> (⋮)</li>
                <li>Kies <strong>&apos;App installeren&apos;</strong></li>
                <li>Tik op <strong>&apos;Installeren&apos;</strong></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
