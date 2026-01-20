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

  // Load user's groups from localStorage and fetch their IDs
  useEffect(() => {
    async function loadMyGroups() {
      const savedGroups = localStorage.getItem("my_groups");
      if (savedGroups) {
        try {
          const groups = JSON.parse(savedGroups);

          // Fetch group IDs for each saved group
          const groupsWithIds = await Promise.all(
            groups.map(async (g: any) => {
              const groupData = await getGroup(g.slug);
              return {
                ...g,
                id: groupData?.id,
              };
            })
          );

          setMyGroups(groupsWithIds.filter(g => g.id)); // Only keep groups that exist

          // Pre-select current group for cross-posting
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
          setIsCreator(true); // User created this group
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
      // Get group IDs from localStorage for selected groups
      const groupIds = selectedGroups.length > 0
        ? selectedGroups
        : [group.id];

      const data: CreateOpdracht = {
        groupId: group.id,
        groupIds: groupIds, // Pass all selected groups
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
        setSelectedGroups([group.id]); // Reset to current group
        await loadOpdrachten();

        // Show success message if posted to multiple groups
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
        // Don't allow deselecting all groups
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

  function inviteToGroup() {
    if (!isCreator || !group) {
      alert("Alleen de creator kan anderen uitnodigen");
      return;
    }

    // Find current group in myGroups to get the code
    const currentGroup = myGroups.find(g => g.slug === slug);
    if (!currentGroup) {
      alert("Groep niet gevonden in je lijst");
      return;
    }

    // Create invite data with single group
    const inviteData = [{
      slug: currentGroup.slug,
      name: currentGroup.name,
      code: currentGroup.code,
      createdAt: currentGroup.createdAt
    }];

    const encoded = btoa(JSON.stringify(inviteData));
    const inviteUrl = `${window.location.origin}/?import=${encoded}`;

    navigator.clipboard.writeText(inviteUrl);

    // Also prepare a friendly message for WhatsApp
    const friendlyMessage = `Hey! 👋

Plaats je freelance opdrachten in deze app, dan blijven ze zichtbaar voor de hele groep!

${inviteUrl}

Zo houden we overzicht zonder terug te scrollen in WhatsApp 📱✨`;

    if (confirm("Link gekopieerd! Wil je deze ook direct delen via WhatsApp?")) {
      window.open(`https://wa.me/?text=${encodeURIComponent(friendlyMessage)}`, "_blank");
    }
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

      {/* Group Selector Modal */}
      {showGroupSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              In welke groepen plaatsen?
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Selecteer één of meer groepen waar je deze opdracht wilt plaatsen
            </p>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {myGroups.map((g: any) => {
                const isSelected = selectedGroups.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-[#0A0A0A] border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleGroupSelection(g.id)}
                      className="w-4 h-4 rounded border-gray-700 bg-[#0A0A0A] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
            <p className="text-xs text-gray-500 mb-4">
              {selectedGroups.length} {selectedGroups.length === 1 ? 'groep' : 'groepen'} geselecteerd
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowGroupSelector(false);
                  setSelectedGroups([group.id]); // Reset selection
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
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
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-40 w-full">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">
                ViaVia
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Altijd het overzicht, zonder terugscrollen in WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!showForm && isCreator && (
                <button
                  onClick={inviteToGroup}
                  className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  title="Nodig anderen uit voor deze groep"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Nodig uit
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
            </div>
          </div>

          {/* Groups vertical list */}
          {!showForm && (
            <div className="space-y-2">
              {myGroups.map((g: any) => (
                <div
                  key={g.slug}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-colors ${
                    g.slug === slug
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'bg-[#1A1A1A] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <Link href={`/g/${g.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {g.name?.charAt(0).toUpperCase() || "V"}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate ${g.slug === slug ? 'text-white' : 'text-gray-300'}`}>
                        {g.name || "ViaVia"}
                      </span>
                      {g.code && (
                        <span className="text-xs font-mono text-gray-500 shrink-0">
                          {g.code}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const groupUrl = `${window.location.origin}/g/${g.slug}`;
                        const text = `Check deze freelance opdrachten: ${groupUrl}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                      }}
                      className="text-emerald-600 hover:text-emerald-500 transition-colors p-1"
                      title="Deel link in WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    {g.code && (
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (confirm(`Weet je zeker dat je "${g.name || 'ViaVia'}" wilt verwijderen? Alle opdrachten worden ook verwijderd.`)) {
                            const result = await deleteGroup(g.slug, g.code);
                            if (result.success) {
                              // Remove from localStorage
                              const updatedGroups = myGroups.filter(group => group.slug !== g.slug);
                              localStorage.setItem("my_groups", JSON.stringify(updatedGroups));
                              setMyGroups(updatedGroups);

                              // Clear session storage
                              sessionStorage.removeItem(`group_${g.slug}_show_banner`);
                              sessionStorage.removeItem(`group_${g.slug}_code`);

                              // If we deleted the current group, redirect to home or another group
                              if (g.slug === slug) {
                                if (updatedGroups.length > 0) {
                                  router.push(`/g/${updatedGroups[0].slug}`);
                                } else {
                                  router.push("/");
                                }
                              }
                            } else {
                              alert(result.error || "Er is iets misgegaan");
                            }
                          }
                        }}
                        className="text-gray-600 hover:text-red-400 transition-colors p-1"
                        title="Verwijder groep"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-800 hover:border-gray-700 text-emerald-500 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nieuwe groep
              </Link>
            </div>
          )}
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
              {/* Show selected groups info */}
              {myGroups.length > 1 && selectedGroups.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-800/50">
                  <label className="block text-sm text-gray-400 mb-3">
                    Wordt geplaatst in {selectedGroups.length} groep{selectedGroups.length === 1 ? '' : 'en'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {myGroups.filter(g => selectedGroups.includes(g.id)).map((g: any) => (
                      <div
                        key={g.id}
                        className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                          className="text-emerald-400 hover:text-emerald-300 ml-1"
                          disabled={selectedGroups.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Old group selector - removed */}
              {false && myGroups.length > 1 && (
                <div className="mb-6 pb-6 border-b border-gray-800/50">
                  <label className="block text-sm text-gray-400 mb-3">
                    Plaats in groepen (selecteer één of meer)
                  </label>
                  <div className="space-y-2">
                    {myGroups.map((g: any) => {
                      const isSelected = selectedGroups.includes(g.id);
                      return (
                        <label
                          key={g.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/10 border border-emerald-500/30'
                              : 'bg-[#0A0A0A] border border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleGroupSelection(g.id)}
                            className="w-4 h-4 rounded border-gray-700 bg-[#0A0A0A] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                            disabled={formLoading}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                  <p className="text-xs text-gray-600 mt-3">
                    {selectedGroups.length} {selectedGroups.length === 1 ? 'groep' : 'groepen'} geselecteerd
                  </p>
                </div>
              )}

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
          onClick={() => {
            if (myGroups.length > 1) {
              setShowGroupSelector(true);
            } else {
              setShowForm(true);
            }
          }}
          className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <span className="text-3xl font-bold">+</span>
        </button>
      )}

    </div>
  );
}
