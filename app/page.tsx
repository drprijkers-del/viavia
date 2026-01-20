"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { listOpdrachten } from "@/app/actions/queries";
import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";
import { formatTariff } from "@/lib/utils";

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [justPostedId, setJustPostedId] = useState<string | null>(null);
  const [selectedLocatie, setSelectedLocatie] = useState<"Remote" | "OnSite" | "Hybride">("Remote");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const loadOpdrachten = useCallback(async () => {
    setLoading(true);
    const result = await listOpdrachten({ status: "OPEN", sort: "recent" });
    setOpdrachten(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOpdrachten();
  }, [loadOpdrachten]);

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchInput(value);
      setLoading(true);
      const result = await listOpdrachten({
        status: "OPEN",
        sort: "recent",
        search: value || undefined,
      });
      setOpdrachten(result);
      setLoading(false);
    },
    []
  );

  const shareOnWhatsApp = (job: any) => {
    const url = `${window.location.origin}/opdracht/${job.id}`;
    const text = `🚀 Check deze opdracht!\n\n${job.titel}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const recommendToSomeone = (job: any) => {
    const url = `${window.location.origin}/opdracht/${job.id}`;
    const text = `Hey! Ik dacht dat deze opdracht perfect voor je is:\n\n${job.titel}\n\n${url}`;
    // Opens WhatsApp to manually select contact
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);

      const data: CreateOpdracht = {
        titel: formData.get("titel") as string,
        omschrijving: formData.get("omschrijving") as string,
        locatie: selectedLocatie,
        plaats: selectedLocatie !== "Remote" ? (formData.get("plaats") as string) || undefined : undefined,
        hybride_dagen_per_week: selectedLocatie === "Hybride" ? parseInt(formData.get("hybride_dagen") as string) || undefined : undefined,
        uurtarief_min: parseInt(formData.get("uurtarief_min") as string) || undefined,
        uurtarief_max: parseInt(formData.get("uurtarief_max") as string) || undefined,
        startdatum: (formData.get("startdatum") as string) || undefined,
        duur: (formData.get("duur") as string) || undefined,
        inzet: (formData.get("inzet") as string) || undefined,
        tags: tags.length > 0 ? tags : undefined,
        plaatser_naam: formData.get("plaatser_naam") as string,
        plaatser_whatsapp: formData.get("plaatser_whatsapp") as string,
      };

      const result = await createOpdracht(data);

      if (result.success) {
        setJustPostedId(result.opdrachtId || null);
        if (form) form.reset();
        setSelectedLocatie("Remote");
        setTags([]);
        setTagInput("");
        await loadOpdrachten();
      } else {
        setError(result.error || "Er is iets misgegaan");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Fout bij plaatsen opdracht");
    }
    setFormLoading(false);
  }

  // Success modal after posting
  if (justPostedId) {
    const justPosted = opdrachten.find((j) => j.id === justPostedId);
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-emerald-500/30 shadow-2xl animate-slide-in">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Opdracht geplaatst!
            </h2>
            <p className="text-gray-400 text-sm">
              Deel nu direct in je WhatsApp groep
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (justPosted) shareOnWhatsApp(justPosted);
                setJustPostedId(null);
              }}
              className="btn btn-primary w-full text-lg py-4"
            >
              💬 Deel in groep
            </button>

            <button
              onClick={() => {
                if (justPosted) recommendToSomeone(justPosted);
                setJustPostedId(null);
              }}
              className="btn bg-blue-600 hover:bg-blue-500 text-white w-full text-lg py-4"
            >
              👤 Beveel aan iemand aan
            </button>

            <button
              onClick={() => setJustPostedId(null)}
              className="btn btn-outline w-full"
            >
              ✓ Sluiten
            </button>

            <button
              onClick={() => {
                setJustPostedId(null);
                setShowForm(true);
              }}
              className="btn btn-secondary w-full"
            >
              + Nog een opdracht plaatsen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 pb-24 flex flex-col items-center">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-40 w-full">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  ViaVia
                </h1>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  Freelance opdrachten delen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showForm && (
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline text-xs px-3 py-1.5"
                >
                  ← Terug
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-5 sm:px-6 py-6 sm:py-8">
        {/* Form Modal/Overlay */}
        {showForm && (
          <div className="mb-8 glass rounded-2xl p-6 sm:p-8 animate-slide-in">
            <h2 className="text-3xl font-bold mb-3 text-white">Nieuwe opdracht</h2>
            <p className="text-stone-400 text-base mb-8">Vul de opdracht in, super simpel</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-base font-medium mb-3 text-stone-200">
                  📝 Wat is de opdracht? *
                </label>
                <input
                  type="text"
                  name="titel"
                  className="input text-lg py-4"
                  placeholder="bijv: React Developer gezocht"
                  required
                  disabled={formLoading}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-3 text-stone-200">
                  📄 Details / omschrijving *
                </label>
                <textarea
                  name="omschrijving"
                  className="textarea text-base py-4"
                  placeholder="Vertel meer over de opdracht..."
                  required
                  disabled={formLoading}
                  rows={5}
                />
              </div>

              {/* Locatie Section */}
              <div className="border-t border-stone-800/50 pt-7">
                <h3 className="text-base font-semibold mb-5 text-stone-300">
                  Locatie & Werkplek
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      📍 Type locatie *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Remote", "OnSite", "Hybride"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedLocatie(type)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            selectedLocatie === type
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                          disabled={formLoading}
                        >
                          {type === "Remote" && "Remote"}
                          {type === "OnSite" && "Op locatie"}
                          {type === "Hybride" && "Hybride"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedLocatie !== "Remote" && (
                    <div>
                      <label className="block text-base font-medium mb-3 text-stone-200">
                        🏢 Plaats {selectedLocatie === "Hybride" ? "(optioneel)" : "*"}
                      </label>
                      <input
                        type="text"
                        name="plaats"
                        className="input py-3.5"
                        placeholder="bijv: Amsterdam, Rotterdam"
                        required={selectedLocatie === "OnSite"}
                        disabled={formLoading}
                      />
                    </div>
                  )}

                  {selectedLocatie === "Hybride" && (
                    <div>
                      <label className="block text-base font-medium mb-3 text-stone-200">
                        📅 Dagen op locatie per week *
                      </label>
                      <select
                        name="hybride_dagen"
                        className="input py-3.5"
                        required
                        disabled={formLoading}
                        defaultValue=""
                      >
                        <option value="" disabled>Selecteer aantal dagen</option>
                        <option value="1">1 dag</option>
                        <option value="2">2 dagen</option>
                        <option value="3">3 dagen</option>
                        <option value="4">4 dagen</option>
                        <option value="5">5 dagen</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarief & Details Section */}
              <div className="border-t border-stone-800/50 pt-7">
                <h3 className="text-base font-semibold mb-5 text-stone-300">
                  Tarief & Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      💰 Uurtarief (€) *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="uurtarief_min"
                        className="input py-3.5"
                        placeholder="Min. tarief"
                        min="0"
                        step="5"
                        required
                        disabled={formLoading}
                      />
                      <input
                        type="number"
                        name="uurtarief_max"
                        className="input py-3.5"
                        placeholder="Max. tarief (opt)"
                        min="0"
                        step="5"
                        disabled={formLoading}
                      />
                    </div>
                    <p className="text-sm text-stone-500 mt-2">
                      Vul je uurtarief in euro's (bijv: 75)
                    </p>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      📅 Startdatum (optioneel)
                    </label>
                    <input
                      type="text"
                      name="startdatum"
                      className="input py-3.5"
                      placeholder="bijv: ASAP, 1 maart 2026"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-base font-medium mb-3 text-stone-200">
                        ⏱️ Uren/week (opt)
                      </label>
                      <input
                        type="text"
                        name="inzet"
                        className="input py-3.5"
                        placeholder="bijv: 32 uur"
                        disabled={formLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium mb-3 text-stone-200">
                        📆 Duur (opt)
                      </label>
                      <input
                        type="text"
                        name="duur"
                        className="input py-3.5"
                        placeholder="bijv: 6 maanden"
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      🏷️ Tags (max 5, optioneel)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="input py-3 flex-1"
                        placeholder="bijv: React, TypeScript"
                        disabled={formLoading || tags.length >= 5}
                        maxLength={20}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={formLoading || tags.length >= 5 || !tagInput.trim()}
                        className="btn btn-secondary px-6"
                      >
                        + Toevoegen
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-full text-sm font-medium"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-emerald-300"
                              disabled={formLoading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-stone-500 mt-2">
                      Voeg tags toe om je opdracht beter vindbaar te maken
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-800/50 pt-7">
                <h3 className="text-base font-semibold mb-5 text-stone-300">
                  Jouw contact info
                </h3>

                <div className="space-y-7">
                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      👤 Jouw naam *
                    </label>
                    <input
                      type="text"
                      name="plaatser_naam"
                      className="input py-3.5"
                      placeholder="John Doe"
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-3 text-stone-200">
                      📱 WhatsApp nummer *
                    </label>
                    <input
                      type="tel"
                      name="plaatser_whatsapp"
                      className="input py-3.5"
                      placeholder="+31612345678"
                      required
                      disabled={formLoading}
                    />
                    <p className="text-sm text-stone-500 mt-2">
                      Zodat mensen je kunnen bereiken
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg py-5 font-semibold shadow-xl mt-8"
                disabled={formLoading}
              >
                {formLoading ? "Bezig..." : "✓ Plaats opdracht"}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        {!showForm && (
          <div className="mb-10 mt-8 animate-slide-in">
            <input
              type="text"
              placeholder="🔍 Zoeken..."
              className="input w-full text-lg"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}

        {/* Job Tiles */}
        {!showForm && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p>Laden...</p>
              </div>
            ) : opdrachten.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">📭</div>
                <p className="text-gray-400 text-lg mb-6">
                  {searchInput ? "Geen opdrachten gevonden" : "Nog geen opdrachten"}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  + Plaats de eerste opdracht
                </button>
              </div>
            ) : (
              opdrachten.map((job, index) => {
                const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                const whatsappLink = `https://wa.me/${job.plaatser_whatsapp?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hoi ${job.plaatser_naam}, ik ben geïnteresseerd in je opdracht: "${job.titel}"`)}`;

                // Format tarief using utility function
                const tarief = (job.uurtarief_min || job.uurtarief_max)
                  ? formatTariff(job.uurtarief_min, job.uurtarief_max, job.valuta || "EUR")
                  : null;

                // Format locatie
                let locatie = "";
                if (job.locatie === "Remote") locatie = "Remote";
                else if (job.locatie === "OnSite") locatie = "Op locatie";
                else if (job.locatie === "Hybride") locatie = "Hybride";

                return (
                  <div
                    key={job.id}
                    className={`job-tile ${job.status === "INGEVULD" ? "job-tile-filled" : ""} animate-slide-in relative`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex gap-4">
                      {/* Creator Photo + WhatsApp Link */}
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 touch-feedback"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-emerald-500/20">
                          {job.plaatser_naam?.charAt(0).toUpperCase() || "?"}
                        </div>
                      </a>

                      {/* Job Info */}
                      <Link href={`/opdracht/${job.id}`} className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 pr-4">
                            <h3 className="job-title text-xl font-bold text-white leading-tight">
                              {job.titel}
                            </h3>
                          </div>
                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <span className={`badge ${job.status === "OPEN" ? "badge-open" : "badge-filled"}`}>
                              {job.status === "OPEN" ? "🟢 Open" : "✓ Ingevuld"}
                            </span>
                            {/* New Badge - exactly same style as badge-open */}
                            {isNew && job.status === "OPEN" && (
                              <span className="badge badge-open">
                                ✨ NIEUW
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Job Details Grid */}
                        <div className="space-y-2 text-sm">
                          {tarief && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">💰</span>
                              <span className="text-emerald-400 font-semibold">{tarief}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{locatie}</span>
                            {job.plaats && (
                              <span className="text-gray-500">• {job.plaats}</span>
                            )}
                            {job.hybride_dagen_per_week && (
                              <span className="text-gray-500">• {job.hybride_dagen_per_week}d/week</span>
                            )}
                          </div>

                          {job.inzet && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">⏱️</span>
                              <span className="text-gray-300">{job.inzet}</span>
                            </div>
                          )}

                          {job.duur && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📅</span>
                              <span className="text-gray-300">{job.duur}</span>
                            </div>
                          )}

                          {/* Tags */}
                          {job.tags && JSON.parse(job.tags).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {JSON.parse(job.tags).slice(0, 3).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {JSON.parse(job.tags).length > 3 && (
                                <span className="px-2 py-0.5 text-gray-500 text-xs">
                                  +{JSON.parse(job.tags).length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Reacties counter */}
                          {job._count?.reacties > 0 && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-800/50 mt-3">
                              <span className="text-gray-400">💬</span>
                              <span className="text-gray-400 text-xs">
                                {job._count.reacties} {job._count.reacties === 1 ? "reactie" : "reacties"}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
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
          className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
          style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)' }}
        >
          <span className="text-3xl md:text-4xl font-bold">+</span>
        </button>
      )}
    </div>
  );
}
