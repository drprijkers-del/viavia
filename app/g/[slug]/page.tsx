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
  const [isCreator, setIsCreator] = useState(false);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ slug: string; name: string; code: string } | null>(null);
  const [deleteCodeInput, setDeleteCodeInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMyGroups() {
      const savedGroups = localStorage.getItem("my_groups");
      if (savedGroups) {
        try {
          const groups = JSON.parse(savedGroups);

          const groupsWithIds = await Promise.all(
            groups.map(async (g: any) => {
              const groupData = await getGroup(g.slug);
              return {
                ...g,
                id: groupData?.id,
              };
            })
          );

          setMyGroups(groupsWithIds.filter(g => g.id));

          if (group) {
            setSelectedGroups([group.id]);
          }
        } catch (e) {
          console.error("Error loading groups:", e);
        }
      }
    }

    loadMyGroups();
  }, [group]);

  useEffect(() => {
    async function loadGroup() {
      setGroupLoading(true);
      const groupData = await getGroup(slug);
      setGroup(groupData);
      setGroupLoading(false);

      if (!groupData) {
        return;
      }

      const showBannerFlag = sessionStorage.getItem(`group_${slug}_show_banner`);
      const storedCode = sessionStorage.getItem(`group_${slug}_code`);
      if (showBannerFlag === "true") {
        setShowBanner(true);
        if (storedCode) {
          setGroupCode(storedCode);
          setIsCreator(true);
        }
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const groupIds = selectedGroups.length > 0
        ? selectedGroups
        : [group.id];

      const data: CreateOpdracht = {
        groupId: group.id,
        groupIds: groupIds,
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
        setSelectedGroups([group.id]);
        await loadOpdrachten();

        if (result.count && result.count > 1) {
          alert(`Opdracht geplaatst in ${result.count} groepen!`);
        }
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

  function toggleGroupSelection(groupId: string) {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  }

  function dismissBanner() {
    setShowBanner(false);
    sessionStorage.removeItem(`group_${slug}_show_banner`);
  }

  async function handleDeleteGroup() {
    if (!groupToDelete) return;

    if (deleteCodeInput !== groupToDelete.code) {
      setDeleteError("Onjuiste groepscode");
      return;
    }

    setDeleteError("");

    const result = await deleteGroup(groupToDelete.slug, groupToDelete.code);
    if (result.success) {
      const updatedGroups = myGroups.filter(g => g.slug !== groupToDelete.slug);
      localStorage.setItem("my_groups", JSON.stringify(updatedGroups));
      setMyGroups(updatedGroups);

      sessionStorage.removeItem(`group_${groupToDelete.slug}_show_banner`);
      sessionStorage.removeItem(`group_${groupToDelete.slug}_code`);

      setShowDeleteModal(false);
      setGroupToDelete(null);
      setDeleteCodeInput("");

      if (groupToDelete.slug === slug) {
        if (updatedGroups.length > 0) {
          router.push(`/g/${updatedGroups[0].slug}`);
        } else {
          router.push("/");
        }
      }
    } else {
      setDeleteError(result.error || "Er is iets misgegaan");
    }
  }

  function shareWhatsApp() {
    const url = window.location.href;
    const groupName = group?.name || "ViaVia";

    const text = `📱 *Zet voortaan je freelance opdrachten in ViaVia!*

👋 Hey! Vanaf nu gebruiken we ${groupName !== "ViaVia" ? `*${groupName}* op ` : ""}ViaVia voor alle freelance opdrachten uit onze groep.

✨ *Waarom?*
• Altijd overzicht van alle opdrachten
• Nooit meer terugscrollen in WhatsApp
• Makkelijk delen met je netwerk
• Direct contact via WhatsApp

📱 Bekijk opdrachten en plaats je eigen opdracht:
${url}

💼 _Help elkaar en plaats ook jouw opdrachten!_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (groupLoading) {
    return (
      <div className="app-frame">
        <div className="app-container flex items-center justify-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-2 border-[#34C759] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-secondary">Laden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="app-frame">
        <div className="app-container flex items-center justify-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Groep niet gevonden
            </h2>
            <Link href="/">
              <button className="btn btn-primary">
                ← Terug naar home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        {/* Delete Modal */}
        {showDeleteModal && groupToDelete && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Groep verwijderen
              </h2>
              <p className="text-secondary mb-2">
                Weet je zeker dat je <span className="text-white font-semibold">{groupToDelete.name}</span> wilt verwijderen?
              </p>
              <p className="text-[#FF453A] text-sm mb-6">
                ⚠️ Alle opdrachten in deze groep worden ook permanent verwijderd.
              </p>

              <div className="mb-6">
                <label className="block text-sm text-secondary mb-2">
                  Voer de groepscode in ter bevestiging:
                </label>
                <input
                  type="text"
                  value={deleteCodeInput}
                  onChange={(e) => setDeleteCodeInput(e.target.value)}
                  className="input font-mono"
                  placeholder="Groepscode"
                  autoFocus
                />
                {deleteError && (
                  <p className="text-[#FF453A] text-sm mt-2">{deleteError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setGroupToDelete(null);
                    setDeleteCodeInput("");
                    setDeleteError("");
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="flex-1 bg-[#FF453A] hover:bg-[#FF3B30] text-white font-medium py-3 rounded-full transition-all"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Banner */}
        {showBanner && (
          <div className="card mb-6 bg-[#34C759]/10 border border-[#34C759]/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent text-lg">✓</span>
                  <h3 className="text-white font-medium">Klaar! Deel in WhatsApp</h3>
                </div>
                {groupCode && (
                  <p className="text-sm text-accent mb-3">
                    Code: <span className="font-mono font-bold">{groupCode}</span>
                  </p>
                )}
                <button
                  onClick={shareWhatsApp}
                  className="btn btn-primary text-sm"
                >
                  Deel in WhatsApp
                </button>
              </div>
              <button
                onClick={dismissBanner}
                className="text-tertiary hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Group Selector Modal */}
        {showGroupSelector && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                In welke groepen plaatsen?
              </h2>
              <p className="text-secondary text-sm mb-6">
                Selecteer één of meer groepen waar je deze opdracht wilt plaatsen
              </p>
              <div className="list-gap mb-6 max-h-60 overflow-y-auto">
                {myGroups.map((g: any) => {
                  const isSelected = selectedGroups.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className={`card card-interactive ${
                        isSelected ? 'bg-[#34C759]/10 border border-[#34C759]/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGroupSelection(g.id)}
                          className="w-4 h-4 rounded border-[#3A3A3C] bg-[#1C1C1E] text-[#34C759] focus:ring-[#34C759] focus:ring-offset-0"
                        />
                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white text-xs font-bold">
                          {g.name?.charAt(0).toUpperCase() || "V"}
                        </div>
                        <span className="text-white text-sm">
                          {g.name || "ViaVia"}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-tertiary mb-4">
                {selectedGroups.length} {selectedGroups.length === 1 ? 'groep' : 'groepen'} geselecteerd
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowGroupSelector(false);
                    setSelectedGroups([group.id]);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Annuleren
                </button>
                <button
                  onClick={() => {
                    if (selectedGroups.length === 0) {
                      alert("Selecteer minimaal één groep");
                      return;
                    }
                    setShowGroupSelector(false);
                    setShowForm(true);
                  }}
                  disabled={selectedGroups.length === 0}
                  className="btn btn-primary flex-1"
                >
                  Verder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 mt-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            {group.name || "ViaVia"}
          </h1>
          <p className="text-sm text-tertiary">
            Altijd het overzicht, geen scrollen in WhatsApp
          </p>
        </div>

        {/* Search Bar */}
        {!showForm && opdrachten.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op functie, bedrijf..."
                className="input pl-10"
              />
              <svg className="w-5 h-5 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Nieuwe opdracht</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-secondary hover:text-white transition-colors"
              >
                Annuleer
              </button>
            </div>

            {error && (
              <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl p-4 mb-6 text-[#FF453A] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {myGroups.length > 1 && selectedGroups.length > 0 && (
                <div className="mb-6 pb-6 border-b border-[#3A3A3C]">
                  <label className="block text-sm text-secondary mb-3">
                    Plaatsen in {selectedGroups.length} groep{selectedGroups.length === 1 ? '' : 'en'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {myGroups.filter(g => selectedGroups.includes(g.id)).map((g: any) => (
                      <div
                        key={g.id}
                        className="bg-[#34C759]/10 border border-[#34C759]/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white text-xs font-bold">
                          {g.name?.charAt(0).toUpperCase() || "V"}
                        </div>
                        <span className="text-white text-sm">{g.name || "ViaVia"}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedGroups.length > 1) {
                              toggleGroupSelection(g.id);
                            }
                          }}
                          className="text-accent hover:opacity-80 ml-1"
                          disabled={selectedGroups.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-secondary mb-1">Functie</label>
                  <input type="text" name="titel" className="input" placeholder="Senior React Developer" required disabled={formLoading} />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Bedrijf</label>
                  <input type="text" name="bedrijf" className="input" placeholder="Coolblue" required disabled={formLoading} />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Uurtarief</label>
                  <div className="flex items-center gap-2">
                    <span className="text-tertiary">€</span>
                    <input type="number" name="uurtarief" className="input" placeholder="100" min="0" step="5" required disabled={formLoading} />
                    <span className="text-tertiary text-sm">/uur</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Locatie</label>
                  <select name="locatie" className="input" required disabled={formLoading}>
                    <option value="Remote">Remote</option>
                    <option value="Hybride">Hybride</option>
                    <option value="OnSite">Op locatie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Plaats (optioneel)</label>
                  <input type="text" name="locatie_detail" className="input" placeholder="Amsterdam" disabled={formLoading} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-secondary mb-1">Uren/week</label>
                    <input type="number" name="uren_per_week" className="input" placeholder="32" min="0" max="40" disabled={formLoading} />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">Duur (mnd)</label>
                    <input type="number" name="duur_maanden" className="input" placeholder="6" min="1" max="24" disabled={formLoading} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Team (optioneel)</label>
                  <input type="text" name="teamgrootte" className="input" placeholder="2-5" disabled={formLoading} />
                </div>

                <div>
                  <label className="block text-sm text-secondary mb-1">Omschrijving</label>
                  <textarea name="omschrijving" className="textarea" placeholder="Korte beschrijving" rows={3} maxLength={280} required disabled={formLoading} />
                </div>

                <div className="border-t border-[#3A3A3C] pt-4 mt-4">
                  <div>
                    <label className="block text-sm text-secondary mb-1">Jouw naam</label>
                    <input type="text" name="plaatser_naam" className="input" placeholder="John Doe" required disabled={formLoading} />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm text-secondary mb-1">WhatsApp</label>
                    <input type="tel" name="plaatser_whatsapp" className="input" placeholder="+31612345678" required disabled={formLoading} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={formLoading} className="btn btn-primary w-full mt-6">
                {formLoading ? "Plaatsen..." : "Plaats opdracht"}
              </button>
            </form>
          </div>
        )}

        {/* Job List */}
        {!showForm && (
          <div className="list-gap">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-10 h-10 border-2 border-[#34C759] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-secondary">Laden...</p>
              </div>
            ) : opdrachten.length === 0 ? (
              <>
                <div onClick={() => {
                  if (myGroups.length > 1) {
                    setShowGroupSelector(true);
                  } else {
                    setShowForm(true);
                  }
                }} className="job-card opacity-50">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#636366] to-[#48484A] flex items-center justify-center text-white text-lg font-bold shrink-0">
                      ?
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1">Plaats je opdracht hier...</h3>
                      <p className="text-sm text-secondary mb-2">Je bedrijfsnaam</p>
                      <div className="meta-info">
                        <span className="text-accent font-semibold">€85/uur</span>
                        <span className="meta-separator"></span>
                        <span>Remote</span>
                        <span className="meta-separator"></span>
                        <span>32u/w</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-8">
                  <p className="text-sm text-tertiary">
                    Klik op het voorbeeld om je eerste opdracht te plaatsen
                  </p>
                </div>
              </>
            ) : (
              opdrachten
                .filter((job) => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    job.titel?.toLowerCase().includes(query) ||
                    job.bedrijf?.toLowerCase().includes(query) ||
                    job.omschrijving?.toLowerCase().includes(query)
                  );
                })
                .map((job) => {
                const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                const reactiesCount = job._count?.reacties || 0;

                return (
                  <Link key={job.id} href={`/g/${slug}/j/${job.id}`} className="job-card">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {job.bedrijf?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-medium">{job.titel}</h3>
                          {isNew && (
                            <span className="badge badge-open text-[10px] px-2 py-0.5">NIEUW</span>
                          )}
                        </div>
                        <p className="text-sm text-secondary mb-2">{job.bedrijf}</p>
                        <div className="meta-info">
                          <span className="text-accent font-semibold">€{job.uurtarief}/uur</span>
                          <span className="meta-separator"></span>
                          <span>{job.locatie === "Remote" ? "Remote" : job.locatie === "Hybride" ? "Hybride" : "Op locatie"}</span>
                          {job.uren_per_week && (
                            <>
                              <span className="meta-separator"></span>
                              <span>{job.uren_per_week}u/w</span>
                            </>
                          )}
                        </div>
                        {reactiesCount > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#3A3A3C]">
                            <span className="text-xs text-tertiary">
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

      {/* FAB */}
      {!showForm && (
        <button
          onClick={() => {
            if (myGroups.length > 1) {
              setShowGroupSelector(true);
            } else {
              setShowForm(true);
            }
          }}
          className="fab"
        >
          <span className="text-3xl">+</span>
        </button>
      )}
    </div>
  );
}
