"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { listOpdrachten } from "@/app/actions/queries";
import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [justPostedId, setJustPostedId] = useState<string | null>(null);

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
        locatie: "Remote",
        plaatser_naam: formData.get("plaatser_naam") as string,
        plaatser_whatsapp: formData.get("plaatser_whatsapp") as string,
      };

      const result = await createOpdracht(data);

      if (result.success) {
        setJustPostedId(result.opdrachtId || null);
        if (form) form.reset();
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
              {!showForm && (
                <Link href="/kandidaten">
                  <button className="btn btn-outline text-xs px-3 py-2">
                    Kandidaten
                  </button>
                </Link>
              )}
              {showForm && (
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline"
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

            <form onSubmit={handleSubmit} className="space-y-7">
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

                // Format tarief - simple display, no thousand separator for hourly rates
                const tarief = (job.uurtarief_min || job.uurtarief_max)
                  ? `€${job.uurtarief_min || job.uurtarief_max}${job.uurtarief_min && job.uurtarief_max && job.uurtarief_min !== job.uurtarief_max ? ` - €${job.uurtarief_max}` : ''}/uur`
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

                          {locatie && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-300">{locatie}</span>
                            </div>
                          )}

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
          className="fixed bottom-6 right-6 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
          style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)' }}
        >
          <span className="text-3xl md:text-4xl font-bold">+</span>
        </button>
      )}
    </div>
  );
}
