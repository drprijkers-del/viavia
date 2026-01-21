"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ViaViaLogo from "@/app/components/ViaViaLogo";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

export default function AuthSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [inPwa, setInPwa] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInPwa(isStandalone());
  }, []);

  useEffect(() => {
    // If already in PWA, skip this page and go directly to dashboard
    if (inPwa && status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [inPwa, status, router]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="app-frame flex flex-col items-center justify-center min-h-screen">
        <ViaViaLogo size="md" />
        <div className="mt-8">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // If in PWA, show redirecting (will auto-redirect)
  if (inPwa) {
    return (
      <div className="app-frame flex flex-col items-center justify-center min-h-screen">
        <ViaViaLogo size="md" />
        <div className="mt-8">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
        </div>
        <p className="text-muted text-sm mt-4">Doorsturen...</p>
      </div>
    );
  }

  // Success page for browser (after magic link click)
  return (
    <div className="app-frame flex flex-col items-center justify-center min-h-screen">
      <ViaViaLogo size="md" />

      <div className="card w-full max-w-sm mt-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Je bent ingelogd</h1>

        {/* Platform-specific instructions */}
        {platform === "ios" && (
          <div className="mb-6">
            <p className="text-muted mb-4">
              Open nu ViaVia vanaf je beginscherm om verder te gaan.
            </p>
            <div className="bg-surface2 rounded-xl p-4 text-left">
              <p className="text-sm text-muted mb-2 font-medium">Op iPhone/iPad:</p>
              <ol className="text-sm text-muted space-y-1">
                <li>1. Sluit Safari</li>
                <li>2. Open de <span className="text-white font-medium">ViaVia</span> app op je beginscherm</li>
              </ol>
            </div>
          </div>
        )}

        {platform === "android" && (
          <div className="mb-6">
            <p className="text-muted mb-4">
              Open nu ViaVia vanaf je beginscherm om verder te gaan.
            </p>
            <div className="bg-surface2 rounded-xl p-4 text-left">
              <p className="text-sm text-muted mb-2 font-medium">Op Android:</p>
              <ol className="text-sm text-muted space-y-1">
                <li>1. Ga naar je beginscherm</li>
                <li>2. Open de <span className="text-white font-medium">ViaVia</span> app</li>
              </ol>
            </div>
          </div>
        )}

        {platform === "desktop" && (
          <div className="mb-6">
            <p className="text-muted">
              Je bent succesvol ingelogd en kunt nu verder.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {platform === "desktop" ? (
            <Link href="/dashboard">
              <button className="btn btn-primary w-full">
                Ga naar dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/dashboard">
                <button className="btn btn-secondary w-full">
                  Ga verder in browser
                </button>
              </Link>
              <p className="text-tertiary text-xs">
                Nog geen app? <Link href="/download" className="text-accent hover:underline">Installeer ViaVia</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
