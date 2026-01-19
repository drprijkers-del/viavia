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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-24">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                ViaVia
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Freelance opdrachten delen
              </p>
            </div>
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

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Form Modal/Overlay */}
        {showForm && (
          <div className="mb-6 glass rounded-2xl p-6 animate-slide-in">
            <h2 className="text-2xl font-bold mb-2 text-white">Nieuwe opdracht</h2>
            <p className="text-gray-400 text-sm mb-6">Vul de opdracht in, super simpel</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  📝 Wat is de opdracht? *
                </label>
                <input
                  type="text"
                  name="titel"
                  className="input text-lg"
                  placeholder="bijv: React Developer gezocht"
                  required
                  disabled={formLoading}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  📄 Details / omschrijving *
                </label>
                <textarea
                  name="omschrijving"
                  className="textarea text-base"
                  placeholder="Vertel meer over de opdracht..."
                  required
                  disabled={formLoading}
                  rows={4}
                />
              </div>

              <div className="border-t border-gray-800 pt-5">
                <h3 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wider">
                  Jouw contact info
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      👤 Jouw naam *
                    </label>
                    <input
                      type="text"
                      name="plaatser_naam"
                      className="input"
                      placeholder="John Doe"
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      📱 WhatsApp nummer *
                    </label>
                    <input
                      type="tel"
                      name="plaatser_whatsapp"
                      className="input"
                      placeholder="+31612345678"
                      required
                      disabled={formLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Zodat mensen je kunnen bereiken
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg py-4 font-semibold"
                disabled={formLoading}
              >
                {formLoading ? "Bezig..." : "✓ Plaats opdracht"}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        {!showForm && (
          <div className="mb-6 animate-slide-in">
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
          <div className="space-y-4">
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

                return (
                  <div
                    key={job.id}
                    className={`job-tile ${job.status === "INGEVULD" ? "job-tile-filled" : ""} animate-slide-in relative overflow-hidden`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* New Badge */}
                    {isNew && job.status === "OPEN" && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-10">
                        ✨ NIEUW
                      </div>
                    )}

                    <Link href={`/opdracht/${job.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="job-title text-2xl font-bold text-white flex-1 pr-4 leading-tight">
                          {job.titel}
                        </h3>
                        <span className={`badge ${job.status === "OPEN" ? "badge-open" : "badge-filled"} flex-shrink-0`}>
                          {job.status === "OPEN" ? "🟢 Open" : "✓ Ingevuld"}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-5 line-clamp-2 text-base leading-relaxed">
                        {job.omschrijving}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                        <span className="flex items-center gap-1.5">
                          <span className="text-base">👤</span>
                          <span>{job.plaatser_naam}</span>
                        </span>
                        {job._count?.reacties > 0 && (
                          <span className="flex items-center gap-1.5">
                            <span className="text-base">💬</span>
                            <span>{job._count.reacties}</span>
                          </span>
                        )}
                        <span className="ml-auto text-xs">
                          {new Date(job.created_at).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2 border-t border-gray-800/50">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          shareOnWhatsApp(job);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Deel</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          recommendToSomeone(job);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
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
