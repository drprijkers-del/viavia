"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed === "true") return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIOSSafari = isIOS && !(navigator as any).standalone;

    // Track visit count
    const visitCount = parseInt(localStorage.getItem("pwa_visit_count") || "0");
    localStorage.setItem("pwa_visit_count", String(visitCount + 1));

    // Show prompt after 2nd visit or on user action
    const shouldShow = visitCount >= 1;

    if (isIOSSafari && shouldShow) {
      setShowIOSPrompt(true);
    }

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (shouldShow) {
        setShowAndroidPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Trigger prompt on user action (e.g., after creating opdracht)
  useEffect(() => {
    const handleUserAction = () => {
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      if (dismissed === "true") return;
      if (window.matchMedia("(display-mode: standalone)").matches) return;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isIOSSafari = isIOS && !(navigator as any).standalone;

      if (isIOSSafari) {
        setShowIOSPrompt(true);
      } else if (deferredPrompt) {
        setShowAndroidPrompt(true);
      }
    };

    window.addEventListener("pwa_trigger_install", handleUserAction);
    return () => window.removeEventListener("pwa_trigger_install", handleUserAction);
  }, [deferredPrompt]);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    }

    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_install_dismissed", "true");
    setShowAndroidPrompt(false);
    setShowIOSPrompt(false);
  };

  if (!showAndroidPrompt && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="card max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white font-bold shrink-0">
            V
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              {showIOSPrompt ? "Zet ViaVia op je beginscherm" : "Installeer ViaVia"}
            </h3>
            {showIOSPrompt ? (
              <p className="text-secondary text-sm mb-3">
                Tik op <span className="inline-block">⬆️</span> (Deel) en kies &apos;Zet op beginscherm&apos;
              </p>
            ) : (
              <p className="text-secondary text-sm mb-3">
                Gebruik ViaVia als app voor snellere toegang
              </p>
            )}
            <div className="flex gap-2">
              {showAndroidPrompt && (
                <button onClick={handleInstallAndroid} className="btn btn-primary text-sm py-2 px-4">
                  Installeren
                </button>
              )}
              <button onClick={handleDismiss} className="btn btn-ghost text-sm py-2 px-4">
                Niet nu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
