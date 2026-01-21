"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import { Suspense } from "react";

type RedirectState = "detecting" | "redirecting" | "fallback";

function CallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<RedirectState>("detecting");
  const [retryCount, setRetryCount] = useState(0);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // User is authenticated - handle redirect
    handleRedirect();
  }, [status, retryCount]);

  function handleRedirect() {
    setState("redirecting");

    // Check if we're in standalone mode (already in PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      // Already in PWA, just navigate
      router.replace(callbackUrl);
      return;
    }

    // We're in the browser - try to open the PWA
    // On iOS/Android, navigating to same-origin URL with PWA installed
    // should open in the PWA if it has matching scope

    // Detect mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Attempt to redirect - PWA should intercept if installed
      // Use location.href for a full navigation that PWA can intercept
      const targetUrl = new URL(callbackUrl, window.location.origin).href;

      // Small delay to ensure auth state is fully synced
      setTimeout(() => {
        window.location.href = targetUrl;

        // If we're still here after 1.5s, the PWA didn't intercept
        setTimeout(() => {
          setState("fallback");
        }, 1500);
      }, 300);
    } else {
      // Desktop - just navigate normally
      router.replace(callbackUrl);
    }
  }

  function handleRetry() {
    setRetryCount((c) => c + 1);
    setState("redirecting");
    window.location.href = new URL(callbackUrl, window.location.origin).href;

    setTimeout(() => {
      setState("fallback");
    }, 1500);
  }

  function handleContinueInBrowser() {
    router.replace(callbackUrl);
  }

  // Loading state
  if (status === "loading" || state === "detecting") {
    return (
      <div className="app-frame flex flex-col items-center justify-center min-h-screen">
        <ViaViaLogo size="md" />
        <div className="mt-8">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
        </div>
        <p className="text-muted text-sm mt-4">Even geduld...</p>
      </div>
    );
  }

  // Redirecting state
  if (state === "redirecting") {
    return (
      <div className="app-frame flex flex-col items-center justify-center min-h-screen">
        <ViaViaLogo size="md" />
        <div className="mt-8">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
        </div>
        <p className="text-muted text-sm mt-4">Je bent ingelogd. We openen nu de app...</p>
      </div>
    );
  }

  // Fallback state - PWA didn't intercept
  return (
    <div className="app-frame flex flex-col items-center justify-center min-h-screen">
      <ViaViaLogo size="md" />

      <div className="card w-full max-w-sm mt-8 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-bold mb-2">Je bent ingelogd!</h1>
        <p className="text-muted text-sm mb-6">
          Kies hoe je verder wilt gaan.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="btn btn-primary w-full"
          >
            Open ViaVia app
          </button>

          <button
            onClick={handleContinueInBrowser}
            className="btn btn-secondary w-full"
          >
            Ga verder in browser
          </button>
        </div>

        <p className="text-tertiary text-xs mt-6">
          Nog geen app? <a href="/download" className="text-accent hover:underline">Installeer ViaVia</a>
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="app-frame flex flex-col items-center justify-center min-h-screen">
          <ViaViaLogo size="md" />
          <div className="mt-8">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
