"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { listOpdrachten } from "@/app/actions/queries";
import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";

export default function HomePage() {
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOpdrachten = useCallback(async () => {
    setLoading(true);
    const result = await listOpdrachten({ status: "OPEN", sort: "recent" });
    setOpdrachten(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOpdrachten();
  }, [loadOpdrachten]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const data: CreateOpdracht = {
        titel: formData.get("titel") as string,
        bedrijf: formData.get("bedrijf") as string,
        omschrijving: formData.get("omschrijving") as string,
        uurtarief: parseInt(formData.get("uurtarief") as string),
        locatie: formData.get("locatie") as "Remote" | "OnSite" | "Hybride",
        locatie_detail: (formData.get("locatie_detail") as string) || undefined,
        uren_per_week: parseInt(formData.get("uren_per_week") as string) || undefined,
        duur_maanden: parseInt(formData.get("duur_maanden") as string) || undefined,
        teamgrootte: (formData.get("teamgrootte") as string) || undefined,
        plaatser_naam: formData.get("plaatser_naam") as string,
        plaatser_whatsapp: formData.get("plaatser_whatsapp") as string,
      };

      const result = await createOpdracht(data);

      if (result.success) {
        form.reset();
        setShowForm(false);
        await loadOpdrachten();
      } else {
        setError(result.error || "Er is iets misgegaan");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Fout bij plaatsen opdracht");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 flex flex-col items-center">
      {/* Header - cleaner, more spacious */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-40 w-full">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                ViaVia
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Freelance opdrachten
              </p>
            </div>
            {showForm && (
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Annuleer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-6 py-8">
        {/* Form - WhatsApp inline style */}
        {showForm && (
          <div className="mb-8 bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-6">Nieuwe opdracht</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Inline inputs - WhatsApp style */}
              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Functie:</label>
                <input
                  type="text"
                  name="titel"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="Senior React Developer"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Bedrijf:</label>
                <input
                  type="text"
                  name="bedrijf"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="Coolblue"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Uurtarief:</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">€</span>
                  <input
                    type="number"
                    name="uurtarief"
                    className="w-24 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                    placeholder="100"
                    min="0"
                    step="5"
                    required
                    disabled={formLoading}
                  />
                  <span className="text-gray-500 text-sm">/uur</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Locatie:</label>
                <select
                  name="locatie"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  required
                  disabled={formLoading}
                >
                  <option value="Remote" className="bg-[#1A1A1A]">Remote</option>
                  <option value="Hybride" className="bg-[#1A1A1A]">Hybride</option>
                  <option value="OnSite" className="bg-[#1A1A1A]">Op locatie</option>
                </select>
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Plaats:</label>
                <input
                  type="text"
                  name="locatie_detail"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="Amsterdam (optioneel)"
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Uren/week:</label>
                <input
                  type="number"
                  name="uren_per_week"
                  className="w-24 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="32"
                  min="0"
                  max="40"
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Duur (mnd):</label>
                <input
                  type="number"
                  name="duur_maanden"
                  className="w-24 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="6"
                  min="1"
                  max="24"
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-center gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0">Team:</label>
                <input
                  type="text"
                  name="teamgrootte"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                  placeholder="2-5 (optioneel)"
                  disabled={formLoading}
                />
              </div>

              <div className="flex items-start gap-3 text-base">
                <label className="text-gray-400 w-32 flex-shrink-0 pt-2">Omschrijving:</label>
                <textarea
                  name="omschrijving"
                  className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors resize-none"
                  placeholder="Korte beschrijving (max 3-4 regels)"
                  rows={3}
                  maxLength={280}
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="border-t border-gray-800/50 pt-6 mt-6">
                <div className="flex items-center gap-3 text-base">
                  <label className="text-gray-400 w-32 flex-shrink-0">Jouw naam:</label>
                  <input
                    type="text"
                    name="plaatser_naam"
                    className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                    placeholder="John Doe"
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="flex items-center gap-3 text-base mt-5">
                  <label className="text-gray-400 w-32 flex-shrink-0">WhatsApp:</label>
                  <input
                    type="tel"
                    name="plaatser_whatsapp"
                    className="flex-1 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none py-2 transition-colors"
                    placeholder="+31612345678"
                    required
                    disabled={formLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {formLoading ? "Plaatsen..." : "Plaats opdracht"}
              </button>
            </form>
          </div>
        )}

        {/* Job Tiles - compact, scannable */}
        {!showForm && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500">Laden...</p>
              </div>
            ) : opdrachten.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">📭</div>
                <p className="text-gray-500 mb-6">Nog geen opdrachten</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Plaats eerste opdracht
                </button>
              </div>
            ) : (
              opdrachten.map((job, index) => {
                const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                const reactiesCount = job._count?.reacties || 0;

                return (
                  <Link
                    key={job.id}
                    href={`/opdracht/${job.id}`}
                    className="block bg-[#1A1A1A] hover:bg-[#222] border border-gray-800/50 rounded-2xl p-6 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {job.bedrijf?.charAt(0).toUpperCase() || "?"}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white leading-tight mb-1">
                              {job.titel}
                            </h3>
                            <p className="text-sm text-gray-500">{job.bedrijf}</p>
                          </div>
                          {isNew && (
                            <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                              NIEUW
                            </span>
                          )}
                        </div>

                        {/* Key info - scannable grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-semibold">€{job.uurtarief}</span>
                            <span className="text-gray-600">/uur</span>
                          </div>
                          <div className="text-gray-400">
                            {job.locatie === "Remote" && "Remote"}
                            {job.locatie === "Hybride" && "Hybride"}
                            {job.locatie === "OnSite" && "Op locatie"}
                            {job.locatie_detail && ` · ${job.locatie_detail}`}
                          </div>
                          {job.uren_per_week && (
                            <div className="text-gray-400">{job.uren_per_week} uur/week</div>
                          )}
                          {job.duur_maanden && (
                            <div className="text-gray-400">{job.duur_maanden} maanden</div>
                          )}
                        </div>

                        {/* Reacties counter */}
                        {reactiesCount > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-800/50">
                            <span className="text-xs text-gray-600">
                              {reactiesCount} {reactiesCount === 1 ? "reactie" : "reacties"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <span className="text-3xl font-bold">+</span>
        </button>
      )}
    </div>
  );
}
