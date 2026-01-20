"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createOpdracht } from "@/app/actions/opdracht";
import Link from "next/link";

interface SavedGroup {
  slug: string;
  name?: string;
  code?: string;
  createdAt: string;
}

interface ImportedOpdrachtData {
  titel: string;
  bedrijf: string;
  omschrijving: string;
  uurtarief: number;
  locatie: "Remote" | "OnSite" | "Hybride";
  locatie_detail?: string;
  uren_per_week?: number;
  duur_maanden?: number;
  teamgrootte?: string;
  plaatser_naam: string;
  plaatser_whatsapp: string;
}

export default function ImportOpdrachtPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opdrachtData, setOpdrachtData] = useState<ImportedOpdrachtData | null>(null);
  const [myGroups, setMyGroups] = useState<SavedGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user's groups
    const savedGroups = localStorage.getItem("my_groups");
    if (savedGroups) {
      try {
        const groups = JSON.parse(savedGroups);
        setMyGroups(groups);
      } catch (e) {
        console.error("Error loading groups:", e);
      }
    }

    // Parse import data from URL
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const decoded = atob(dataParam);
        const data = JSON.parse(decoded) as ImportedOpdrachtData;
        setOpdrachtData(data);
      } catch (e) {
        console.error("Invalid import data:", e);
        setError("Ongeldige opdracht link");
      }
    } else {
      setError("Geen opdracht data gevonden");
    }
  }, [searchParams]);

  function toggleGroup(slug: string) {
    setSelectedGroups((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  }

  async function handleImport() {
    if (!opdrachtData) {
      alert("Geen opdracht data beschikbaar");
      return;
    }

    if (selectedGroups.length === 0) {
      alert("Selecteer minimaal één groep");
      return;
    }

    setLoading(true);

    // Get the first group for the required groupId field
    const primaryGroupId = myGroups.find((g) => g.slug === selectedGroups[0])?.slug;
    if (!primaryGroupId) {
      alert("Geselecteerde groep niet gevonden");
      setLoading(false);
      return;
    }

    try {
      const result = await createOpdracht({
        groupId: primaryGroupId,
        groupIds: selectedGroups,
        titel: opdrachtData.titel,
        bedrijf: opdrachtData.bedrijf,
        omschrijving: opdrachtData.omschrijving,
        uurtarief: opdrachtData.uurtarief,
        locatie: opdrachtData.locatie,
        locatie_detail: opdrachtData.locatie_detail,
        uren_per_week: opdrachtData.uren_per_week,
        duur_maanden: opdrachtData.duur_maanden,
        teamgrootte: opdrachtData.teamgrootte,
        plaatser_naam: opdrachtData.plaatser_naam,
        plaatser_whatsapp: opdrachtData.plaatser_whatsapp,
      });

      if (result.success) {
        alert(`Opdracht geïmporteerd in ${selectedGroups.length} groep${selectedGroups.length === 1 ? "" : "en"}!`);
        router.push(`/g/${primaryGroupId}`);
      } else {
        alert(result.error || "Er is iets misgegaan");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error importing opdracht:", error);
      alert("Er is iets misgegaan bij het importeren");
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-white mb-4">{error}</h2>
          <Link href="/">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors">
              ← Ga naar home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!opdrachtData) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (myGroups.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Maak eerst een groep aan
          </h2>
          <p className="text-gray-400 mb-6">
            Je hebt nog geen groepen. Maak eerst een groep aan om deze opdracht te kunnen importeren.
          </p>
          <Link href="/">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors">
              Naar home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Opdracht importeren
          </h1>
          <p className="text-gray-400">
            Selecteer in welke groepen je deze opdracht wilt plaatsen
          </p>
        </div>

        {/* Opdracht Preview */}
        <div className="bg-[#1A1A1A] border border-gray-800/50 rounded-2xl p-6 mb-6">
          <h2 className="text-sm text-gray-400 mb-4">Preview</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {opdrachtData.titel}
              </h3>
              <p className="text-emerald-500 font-medium">{opdrachtData.bedrijf}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">💰</span>
                <span className="text-white font-medium">€{opdrachtData.uurtarief}/uur</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📍</span>
                <span className="text-white">{opdrachtData.locatie}</span>
              </div>
            </div>

            {opdrachtData.uren_per_week && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">⏱️</span>
                <span className="text-white">{opdrachtData.uren_per_week} uur/week</span>
              </div>
            )}

            <div>
              <p className="text-gray-300 text-sm line-clamp-3">
                {opdrachtData.omschrijving}
              </p>
            </div>
          </div>
        </div>

        {/* Group Selection */}
        <div className="bg-[#1A1A1A] border border-gray-800/50 rounded-2xl p-6 mb-6">
          <h2 className="text-sm text-gray-400 mb-4">
            Selecteer groepen ({selectedGroups.length} geselecteerd)
          </h2>

          <div className="space-y-3">
            {myGroups.map((group) => (
              <label
                key={group.slug}
                className="flex items-center gap-3 bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-700 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(group.slug)}
                  onChange={() => toggleGroup(group.slug)}
                  className="w-5 h-5 rounded border-gray-700 bg-[#1A1A1A] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {group.name?.charAt(0).toUpperCase() || "V"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {group.name || "ViaVia"}
                    </h3>
                    {group.code && (
                      <p className="text-xs text-gray-500 font-mono">
                        Code: {group.code}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-xl transition-colors">
              Annuleren
            </button>
          </Link>
          <button
            onClick={handleImport}
            disabled={loading || selectedGroups.length === 0}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Importeren..." : `Importeer in ${selectedGroups.length} groep${selectedGroups.length === 1 ? "" : "en"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
