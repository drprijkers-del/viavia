"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { listOpdrachten } from "@/app/actions/queries";
import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";
import { getGroup, verifyGroupCode, deleteGroup } from "@/app/actions/group";

export default function GroupBoardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [group, setGroup] = useState<any>(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCodeInput, setDeleteCodeInput] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  // Load group data
  useEffect(() => {
    async function loadGroup() {
      setGroupLoading(true);
      const groupData = await getGroup(slug);
      setGroup(groupData);
      setGroupLoading(false);

      if (!groupData) {
        return;
      }

      // Check for share banner
      const showBannerFlag = sessionStorage.getItem(`group_${slug}_show_banner`);
      const storedCode = sessionStorage.getItem(`group_${slug}_code`);
      if (showBannerFlag === "true") {
        setShowBanner(true);
        if (storedCode) {
          setGroupCode(storedCode);
          setCodeVerified(true); // Creator doesn't need to verify
          setIsCreator(true); // User created this group
        }
      }

      // If no code protection, auto-verify
      if (!groupData.code_hash) {
        setCodeVerified(true);
      }
    }

    if (slug) {
      loadGroup();
    }
  }, [slug]);

  const loadOpdrachten = useCallback(async () => {
    if (!group?.id) return;
    setLoading(true);
    const result = await listOpdrachten({
      groupId: group.id,
      status: "OPEN",
      sort: "recent"
    });
    setOpdrachten(result);
    setLoading(false);
  }, [group?.id]);

  useEffect(() => {
    if (group) {
      loadOpdrachten();
    }
  }, [group, loadOpdrachten]);

  async function handleVerifyCode() {
    if (!codeInput.trim()) {
      setError("Vul de groepscode in");
      return;
    }

    const result = await verifyGroupCode(slug, codeInput.trim());
    if (result.valid) {
      setCodeVerified(true);
      setError("");
    } else {
      setError(result.error || "Onjuiste code");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Check code if needed
    if (group?.code_hash && !codeVerified) {
      setError("Vul eerst de groepscode in");
      return;
    }

    setFormLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const data: CreateOpdracht = {
        groupId: group.id,
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

  function dismissBanner() {
    setShowBanner(false);
    sessionStorage.removeItem(`group_${slug}_show_banner`);
  }

  function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link gekopieerd!");
  }

  function shareWhatsApp() {
    const url = window.location.href;
    const text = `Check deze freelance opdrachten: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function handleDeleteGroup() {
    if (!group) return;

    const code = group.code_hash ? deleteCodeInput : undefined;
    const result = await deleteGroup(slug, code);

    if (result.success) {
      // Clear session storage
      sessionStorage.removeItem(`group_${slug}_show_banner`);
      sessionStorage.removeItem(`group_${slug}_code`);
      // Redirect to home
      router.push("/");
    } else {
      alert(result.error || "Er is iets misgegaan");
    }
  }

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Groep niet gevonden
          </h2>
          <Link href="/">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors">
              ← Terug naar home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 flex flex-col items-center">
      {/* Share Banner - shown once after creation */}
      {showBanner && (
        <div className="w-full bg-emerald-600/10 border-b border-emerald-500/30">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 text-lg">✓</span>
                  <h3 className="text-white font-semibold">Klaar! Deel deze link in WhatsApp</h3>
                </div>
                {groupCode && (
                  <p className="text-sm text-emerald-300 mb-3">
                    Groepscode: <span className="font-mono font-bold">{groupCode}</span> (alleen voor posten/bewerken)
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={shareWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Deel in WhatsApp
                  </button>
                  <button
                    onClick={copyLink}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Kopieer link
                  </button>
                </div>
              </div>
              <button
                onClick={dismissBanner}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-40 w-full">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">
                {group.name || "ViaVia"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Altijd het overzicht, zonder terugscrollen in WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Deel link button - always visible */}
              {!showForm && (
                <button
                  onClick={shareWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Deel link
                </button>
              )}

              {showForm && (
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Annuleer
                </button>
              )}

              {/* Menu button - only for creator */}
              {!showForm && isCreator && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {showMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                      />

                      {/* Menu dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl z-50">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setShowDeleteModal(true);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors rounded-lg"
                        >
                          Verwijder groep
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-6 py-8">
        {/* Code verification (if needed and not verified) */}
        {group.code_hash && !codeVerified && showForm && (
          <div className="mb-6 bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="text-white font-semibold mb-2">Groepscode vereist</h3>
            <p className="text-sm text-gray-400 mb-4">
              Deze groep is beschermd. Vul de groepscode in om een opdracht te plaatsen.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-[#0A0A0A] border border-gray-800 text-white rounded-xl px-4 py-2 focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                placeholder="Bijv. ABC123"
                maxLength={6}
              />
              <button
                onClick={handleVerifyCode}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-colors font-medium"
              >
                Verifieer
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* Form - WhatsApp inline style */}
        {showForm && (!group.code_hash || codeVerified) && (
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
              opdrachten.map((job) => {
                const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                const reactiesCount = job._count?.reacties || 0;

                return (
                  <Link
                    key={job.id}
                    href={`/g/${slug}/j/${job.id}`}
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

      {/* Delete Group Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Groep verwijderen?
            </h2>
            <p className="text-gray-400 mb-6">
              Dit verwijdert de groep inclusief alle opdrachten permanent. Deze actie kan niet ongedaan worden gemaakt.
            </p>

            {group?.code_hash && (
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Groepscode ter bevestiging
                </label>
                <input
                  type="text"
                  value={deleteCodeInput}
                  onChange={(e) => setDeleteCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-[#0A0A0A] border border-gray-800 text-white rounded-xl px-4 py-3 focus:border-red-500 focus:outline-none transition-colors font-mono"
                  placeholder="Vul groepscode in"
                  maxLength={6}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteCodeInput("");
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl transition-colors font-medium"
              >
                Annuleer
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={group?.code_hash && !deleteCodeInput}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verwijder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
