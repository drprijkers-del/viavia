"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { QRCodeSVG } from "qrcode.react";
import { createGroup, joinGroupWithCode } from "@/app/actions/group";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const QRScanner = dynamic(() => import("@/app/components/QRScanner"), {
  ssr: false,
});

interface SavedGroup {
  slug: string;
  name?: string;
  code?: string;
  createdAt: string;
}

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [myGroups, setMyGroups] = useState<SavedGroup[]>([]);
  const [showImportPrompt, setShowImportPrompt] = useState(false);
  const [importData, setImportData] = useState<SavedGroup[] | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeToShow, setQrCodeToShow] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showExportQR, setShowExportQR] = useState(false);
  const [exportUrl, setExportUrl] = useState("");

  useEffect(() => {
    const savedGroups = localStorage.getItem("my_groups");
    if (savedGroups) {
      try {
        const groups = JSON.parse(savedGroups);
        setMyGroups(groups);
      } catch (e) {
        console.error("Error loading groups:", e);
      }
    }

    const importParam = searchParams.get("import");
    if (importParam) {
      try {
        const decoded = atob(importParam);
        const groups = JSON.parse(decoded) as SavedGroup[];
        setImportData(groups);
        setShowImportPrompt(true);
      } catch (e) {
        console.error("Invalid import data:", e);
        alert("Ongeldige import link");
      }
    }
  }, [searchParams]);

  async function handleCreateGroup() {
    setLoading(true);

    const result = await createGroup({
      name: groupName || undefined,
      withCode: true,
    });

    if (result.success && result.slug) {
      if (result.code) {
        sessionStorage.setItem(`group_${result.slug}_code`, result.code);
        sessionStorage.setItem(`group_${result.slug}_show_banner`, "true");
      }

      const newGroup: SavedGroup = {
        slug: result.slug,
        name: groupName || undefined,
        code: result.code || undefined,
        createdAt: new Date().toISOString(),
      };

      const updatedGroups = [...myGroups, newGroup];
      localStorage.setItem("my_groups", JSON.stringify(updatedGroups));
      setMyGroups(updatedGroups);

      router.push(`/g/${result.slug}`);
    } else {
      alert(result.error || "Er is iets misgegaan");
      setLoading(false);
    }
  }

  function removeGroup(slug: string) {
    const updatedGroups = myGroups.filter((g) => g.slug !== slug);
    localStorage.setItem("my_groups", JSON.stringify(updatedGroups));
    setMyGroups(updatedGroups);

    sessionStorage.removeItem(`group_${slug}_code`);
    sessionStorage.removeItem(`group_${slug}_show_banner`);
  }

  function exportGroups() {
    if (myGroups.length === 0) {
      alert("Je hebt nog geen groepen om te exporteren");
      return;
    }

    const encoded = btoa(JSON.stringify(myGroups));
    const url = `${window.location.origin}/?import=${encoded}`;

    setExportUrl(url);
    setShowExportQR(true);
  }

  function handleImport() {
    if (!importData) return;

    const existingSlugs = new Set(myGroups.map(g => g.slug));
    const newGroups = importData.filter(g => !existingSlugs.has(g.slug));

    const mergedGroups = [...myGroups, ...newGroups];
    localStorage.setItem("my_groups", JSON.stringify(mergedGroups));
    setMyGroups(mergedGroups);

    newGroups.forEach(g => {
      if (g.code) {
        sessionStorage.setItem(`group_${g.slug}_code`, g.code);
      }
    });

    setShowImportPrompt(false);
    setImportData(null);

    router.replace("/");

    alert(`${newGroups.length} groep${newGroups.length === 1 ? '' : 'en'} geïmporteerd!`);
  }

  function cancelImport() {
    setShowImportPrompt(false);
    setImportData(null);
    router.replace("/");
  }

  function handleQRScan(scannedCode: string) {
    setShowQRScanner(false);

    // Check if it's an import URL
    if (scannedCode.includes('?import=')) {
      try {
        const url = new URL(scannedCode);
        const importParam = url.searchParams.get('import');
        if (importParam) {
          const decoded = atob(importParam);
          const groups = JSON.parse(decoded) as SavedGroup[];
          setImportData(groups);
          setShowImportPrompt(true);
          return;
        }
      } catch (e) {
        console.error("Invalid import QR:", e);
      }
    }

    // Otherwise treat as group code
    const code = scannedCode.toUpperCase().trim();
    setJoinCode(code);
    setShowJoinModal(true);
    handleJoinGroupWithCode(code);
  }

  async function handleJoinGroupWithCode(code: string) {
    const result = await joinGroupWithCode(code.trim());

    if (result.success && result.group) {
      const exists = myGroups.some(g => g.slug === result.group!.slug);
      if (exists) {
        setJoinError("Je hebt deze groep al in je lijst");
        return;
      }

      const newGroup: SavedGroup = {
        slug: result.group.slug,
        name: result.group.name || undefined,
        code: result.group.code,
        createdAt: new Date().toISOString(),
      };

      const updatedGroups = [...myGroups, newGroup];
      localStorage.setItem("my_groups", JSON.stringify(updatedGroups));
      setMyGroups(updatedGroups);

      sessionStorage.setItem(`group_${result.group.slug}_code`, result.group.code);

      setShowJoinModal(false);
      setJoinCode("");

      // Trigger PWA install prompt on user action
      window.dispatchEvent(new Event("pwa_trigger_install"));

      router.push(`/g/${result.group.slug}`);
    } else {
      setJoinError(result.error || "Groep niet gevonden");
    }
  }

  async function handleJoinGroup() {
    if (!joinCode.trim()) {
      setJoinError("Voer een groepscode in");
      return;
    }

    setJoinError("");
    await handleJoinGroupWithCode(joinCode);
  }

  const hasGroups = myGroups.length > 0;

  return (
    <div className="app-frame">
      <div className="app-container">
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* QR Scanner */}
        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />
        )}

        {/* Export QR Modal */}
        {showExportQR && exportUrl && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Sync met ander device
              </h2>
              <p className="text-secondary text-sm mb-6">
                Scan deze QR code op je andere device om al je groepen te synchroniseren
              </p>
              <div className="bg-white p-6 rounded-2xl mb-6 w-full flex justify-center">
                <QRCodeSVG value={exportUrl} size={200} level="H" />
              </div>
              <div className="mb-6">
                <p className="text-tertiary text-xs mb-2 text-center">Of kopieer deze link:</p>
                <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl p-3">
                  <p className="text-white text-xs break-all">{exportUrl}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportUrl);
                    alert("Link gekopieerd!");
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Kopieer link
                </button>
                <button
                  onClick={() => {
                    setShowExportQR(false);
                    setExportUrl("");
                  }}
                  className="btn btn-primary flex-1"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Display Modal */}
        {showQRModal && qrCodeToShow && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Scan QR Code
              </h2>
              <p className="text-secondary text-sm mb-6">
                Laat iemand anders deze QR code scannen om de groep toe te voegen
              </p>
              <div className="bg-white p-6 rounded-2xl mb-6 w-full flex justify-center">
                <QRCodeSVG value={qrCodeToShow} size={200} level="H" />
              </div>
              <div className="mb-6 text-center">
                <p className="text-tertiary text-xs mb-2">Of deel deze code:</p>
                <p className="text-white font-mono text-2xl tracking-wider">{qrCodeToShow}</p>
              </div>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setQrCodeToShow(null);
                }}
                className="btn btn-primary w-full"
              >
                Sluiten
              </button>
            </div>
          </div>
        )}

        {/* Join Group Modal */}
        {showJoinModal && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Groep toevoegen
              </h2>
              <p className="text-secondary text-sm mb-6">
                Voer de 6-cijferige groepscode in of scan een QR code
              </p>

              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setShowQRScanner(true);
                }}
                className="btn btn-secondary w-full mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan QR Code
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full divider"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#2C2C2E] px-2 text-tertiary">Of typ de code</span>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="input font-mono text-center text-2xl tracking-wider"
                  placeholder="ABC123"
                  maxLength={6}
                  autoFocus
                />
                {joinError && (
                  <p className="text-[#FF453A] text-sm mt-2">{joinError}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode("");
                    setJoinError("");
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleJoinGroup}
                  className="btn btn-primary flex-1"
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Prompt Modal */}
        {showImportPrompt && importData && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Groepen importeren
              </h2>
              <p className="text-secondary mb-6">
                Er {importData.length === 1 ? 'is' : 'zijn'} {importData.length} groep{importData.length === 1 ? '' : 'en'} gevonden om te importeren:
              </p>
              <div className="list-gap mb-6 max-h-60 overflow-y-auto">
                {importData.map((group) => (
                  <div
                    key={group.slug}
                    className="card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white text-sm font-semibold">
                        {group.name?.charAt(0).toUpperCase() || "V"}
                      </div>
                      <span className="text-white text-sm">
                        {group.name || "ViaVia"}
                      </span>
                      {group.code && (
                        <span className="text-xs text-tertiary font-mono ml-auto">
                          {group.code}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelImport}
                  className="btn btn-secondary flex-1"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleImport}
                  className="btn btn-primary flex-1"
                >
                  Importeren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            ViaVia
          </h1>
          <p className="text-sm text-tertiary">
            Freelance opdrachten overzicht
          </p>
        </div>

        {/* My Groups Section */}
        {hasGroups && !showForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Mijn groepen</h2>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-ghost text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nieuw
              </button>
            </div>

            <div className="list-gap">
              {myGroups.map((group) => (
                <div
                  key={group.slug}
                  className="card card-hover"
                >
                  <Link href={`/g/${group.slug}`} className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white font-semibold">
                          {group.name?.charAt(0).toUpperCase() || "V"}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {group.name || "ViaVia"}
                          </h3>
                          {group.code && (
                            <p className="text-xs text-tertiary font-mono">
                              {group.code}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.code && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setQrCodeToShow(group.code || null);
                              setShowQRModal(true);
                            }}
                            className="text-accent hover:opacity-80 transition-opacity p-2 touch-feedback"
                            title="Toon QR code"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Weet je zeker dat je deze groep uit je lijst wilt verwijderen? De groep zelf blijft bestaan.")) {
                              removeGroup(group.slug);
                            }
                          }}
                          className="text-tertiary hover:text-[#FF453A] transition-colors p-2 touch-feedback"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <button
              onClick={exportGroups}
              className="btn btn-ghost w-full mt-4 text-sm"
            >
              Exporteer naar ander device
            </button>
          </div>
        )}

        {/* First Time User - Choice Cards */}
        {!hasGroups && !showForm && !showJoinModal && (
          <div className="list-gap">
            <div
              onClick={() => setShowForm(true)}
              className="card card-interactive card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#34C759]/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    Maak nieuwe groep
                  </h3>
                  <p className="text-sm text-secondary">
                    Start een nieuw overzicht voor jouw WhatsApp groep
                  </p>
                </div>
                <svg className="w-5 h-5 text-tertiary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div
              onClick={() => setShowJoinModal(true)}
              className="card card-interactive card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#34C759]/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    Voeg groep toe
                  </h3>
                  <p className="text-sm text-secondary">
                    Scan QR code of voer groepscode in
                  </p>
                </div>
                <svg className="w-5 h-5 text-tertiary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Create Group Form */}
        {showForm && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {hasGroups ? "Nieuwe groep" : "Maak nieuwe groep"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-secondary hover:text-white transition-colors"
              >
                Annuleer
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-secondary mb-2">
                Naam van de groep (optioneel)
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input"
                placeholder="Bijv. React Freelancers NL"
                disabled={loading}
                autoFocus={showForm}
              />
            </div>

            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Aanmaken..." : "Maak groepsoverzicht"}
            </button>

            <p className="text-xs text-tertiary text-center mt-4">
              Je krijgt direct een link om te delen in WhatsApp
            </p>
          </div>
        )}

        {/* Value prop */}
        {!hasGroups && (
          <div className="mt-12 text-center">
            <p className="text-sm text-tertiary">
              Altijd het overzicht, zonder terugscrollen in WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
