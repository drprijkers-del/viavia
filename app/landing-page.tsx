"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createGroup } from "@/app/actions/group";

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
  const [withCode, setWithCode] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myGroups, setMyGroups] = useState<SavedGroup[]>([]);
  const [showImportPrompt, setShowImportPrompt] = useState(false);
  const [importData, setImportData] = useState<SavedGroup[] | null>(null);

  // Load user's groups from localStorage and check for import param
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

    // Check for import parameter in URL
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
      withCode,
    });

    if (result.success && result.slug) {
      // Store in sessionStorage for immediate access
      if (result.code) {
        sessionStorage.setItem(`group_${result.slug}_code`, result.code);
        sessionStorage.setItem(`group_${result.slug}_show_banner`, "true");
      }

      // Save to localStorage for persistent group list
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

    // Also remove from sessionStorage
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

    navigator.clipboard.writeText(url);
    alert("Export link gekopieerd! Plak deze URL op een ander device om je groepen te importeren.");
  }

  function handleImport() {
    if (!importData) return;

    // Merge with existing groups, avoiding duplicates
    const existingSlugs = new Set(myGroups.map(g => g.slug));
    const newGroups = importData.filter(g => !existingSlugs.has(g.slug));

    const mergedGroups = [...myGroups, ...newGroups];
    localStorage.setItem("my_groups", JSON.stringify(mergedGroups));
    setMyGroups(mergedGroups);

    // Store codes in sessionStorage
    newGroups.forEach(g => {
      if (g.code) {
        sessionStorage.setItem(`group_${g.slug}_code`, g.code);
      }
    });

    setShowImportPrompt(false);
    setImportData(null);

    // Clean URL
    router.replace("/");

    alert(`${newGroups.length} groep${newGroups.length === 1 ? '' : 'en'} geïmporteerd!`);
  }

  function cancelImport() {
    setShowImportPrompt(false);
    setImportData(null);
    router.replace("/");
  }

  const hasGroups = myGroups.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Import Prompt Modal */}
        {showImportPrompt && importData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">
                Groepen importeren
              </h2>
              <p className="text-gray-400 mb-6">
                Er {importData.length === 1 ? 'is' : 'zijn'} {importData.length} groep{importData.length === 1 ? '' : 'en'} gevonden om te importeren:
              </p>
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                {importData.map((group) => (
                  <div
                    key={group.slug}
                    className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        {group.name?.charAt(0).toUpperCase() || "V"}
                      </div>
                      <span className="text-white text-sm">
                        {group.name || "ViaVia"}
                      </span>
                      {group.code && (
                        <span className="text-xs text-gray-500 font-mono ml-auto">
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
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Importeren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            ViaVia
          </h1>
          <p className="text-lg text-gray-400">
            Freelance opdrachten voor je WhatsApp groep
          </p>
        </div>

        {/* My Groups Section */}
        {hasGroups && !showForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Mijn groepen</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportGroups}
                  className="text-sm text-gray-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  title="Exporteer groepen naar ander device"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  + Nieuwe groep
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {myGroups.map((group) => (
                <div
                  key={group.slug}
                  className="bg-[#1A1A1A] border border-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors"
                >
                  <Link href={`/g/${group.slug}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {group.name?.charAt(0).toUpperCase() || "V"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {group.name || "ViaVia"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {group.code && (
                            <span className="font-mono">Code: {group.code}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Weet je zeker dat je deze groep uit je lijst wilt verwijderen? De groep zelf blijft bestaan.")) {
                        removeGroup(group.slug);
                      }
                    }}
                    className="ml-4 text-gray-600 hover:text-red-400 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Group Form */}
        {(!hasGroups || showForm) && (
          <div className="bg-[#1A1A1A] border border-gray-800/50 rounded-2xl p-8">
            {hasGroups && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Nieuwe groep maken
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Annuleer
                </button>
              </div>
            )}

            {!hasGroups && (
              <h2 className="text-xl font-semibold text-white mb-6">
                Maak overzicht voor je WhatsApp groep
              </h2>
            )}

            {/* Optional group name */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Naam van de groep (optioneel)
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Bijv. React Freelancers NL"
                disabled={loading}
              />
            </div>

            {/* Code protection option */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withCode}
                  onChange={(e) => setWithCode(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-700 bg-[#0A0A0A] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                  disabled={loading}
                />
                <div>
                  <span className="text-white text-sm">
                    Bescherm met groepscode
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Alleen tegen spam. Lezen kan altijd zonder code.
                  </p>
                </div>
              </label>
            </div>

            {/* Create button */}
            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Aanmaken..." : "Maak groepsoverzicht"}
            </button>

            {/* Info */}
            <p className="text-xs text-gray-600 text-center mt-6">
              Je krijgt direct een link om te delen in WhatsApp
            </p>
          </div>
        )}

        {/* Value prop */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Altijd het overzicht, zonder terugscrollen in WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
