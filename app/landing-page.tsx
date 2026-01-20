"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [withCode, setWithCode] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myGroups, setMyGroups] = useState<SavedGroup[]>([]);

  // Load user's groups from localStorage
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
  }, []);

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

  const hasGroups = myGroups.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-6">
      <div className="max-w-2xl mx-auto">
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
              <button
                onClick={() => setShowForm(true)}
                className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                + Nieuwe groep
              </button>
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
