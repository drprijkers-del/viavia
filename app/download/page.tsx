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
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" />
          <Link href="/">
            <button className="text-sm text-secondary hover:text-white transition-colors">
              ← Terug
            </button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Download ViaVia
            </h1>
            <p className="text-secondary">
              Installeer ViaVia als app op je apparaat
            </p>
          </div>

          {/* QR Code */}
          <div className="card text-center mb-8">
            <div className="inline-block p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={appUrl}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-tertiary mt-4">
              Scan met je telefoon om ViaVia te openen
            </p>
          </div>

          {/* Install Buttons */}
          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={handleInstall}
              className="btn btn-primary py-4 text-lg"
            >
              Installeer ViaVia
            </button>
            <Link href="/dashboard">
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
                <li>Tik op het <strong>Deel</strong>-icoon (⬆️) onderaan</li>
                <li>Scroll naar beneden en tik op <strong>&apos;Zet op beginscherm&apos;</strong></li>
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
                <li>Tik op het <strong>menu</strong> (⋮) rechtsboven</li>
                <li>Tik op <strong>&apos;App installeren&apos;</strong> of <strong>&apos;Toevoegen aan startscherm&apos;</strong></li>
                <li>Tik op <strong>&apos;Installeren&apos;</strong></li>
              </ol>
            </div>
          </div>

          <div className="card mt-8 text-center">
            <p className="text-sm text-tertiary">
              Na installatie werkt ViaVia als een normale app op je telefoon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
