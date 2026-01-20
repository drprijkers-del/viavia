"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup } from "@/app/actions/group";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [withCode, setWithCode] = useState(true);

  async function handleCreateGroup() {
    setLoading(true);

    const result = await createGroup({
      name: groupName || undefined,
      withCode,
    });

    if (result.success && result.slug) {
      // Store the code in sessionStorage so we can show it on the group page
      if (result.code) {
        sessionStorage.setItem(`group_${result.slug}_code`, result.code);
        sessionStorage.setItem(`group_${result.slug}_show_banner`, "true");
      }
      router.push(`/g/${result.slug}`);
    } else {
      alert(result.error || "Er is iets misgegaan");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            ViaVia
          </h1>
          <p className="text-lg text-gray-400">
            Freelance opdrachten voor je WhatsApp groep
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#1A1A1A] border border-gray-800/50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Maak overzicht voor je WhatsApp groep
          </h2>

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
