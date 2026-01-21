"use client";

import { useEffect, useState } from "react";

export default function OpenInAppBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if running in browser (not PWA standalone mode)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafariStandalone = (navigator as any).standalone === true;

    // Show banner if in browser and PWA might be installed
    // We show this after login redirects (when coming from email link)
    const fromEmailLogin = sessionStorage.getItem("pwa-banner-shown") !== "true";

    if (!isStandalone && !isSafariStandalone && fromEmailLogin) {
      // Small delay to not be too aggressive
      const timer = setTimeout(() => {
        setShowBanner(true);
        sessionStorage.setItem("pwa-banner-shown", "true");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-surface2 rounded-2xl p-4 shadow-elevated max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">Open ViaVia in de app</p>
            <p className="text-xs text-muted">
              Voor de beste ervaring, open ViaVia vanuit je homescreen.
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-muted hover:text-white transition-colors p-1"
            aria-label="Sluiten"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
