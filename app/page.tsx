"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { listOpdrachten, ListOpdrachtQuery } from "@/app/actions/queries";
import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";

export default function HomePage() {
  const [filter, setFilter] = useState<ListOpdrachtQuery>({
    status: "OPEN",
    sort: "recent",
  });
  const [searchInput, setSearchInput] = useState("");
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "rate">("recent");

  // Form state
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locatie, setLocatie] = useState<"Remote" | "OnSite" | "Hybride">("Remote");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("viavia-bookmarks");
    if (saved) {
      setBookmarked(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem("viavia-bookmarks", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const loadOpdrachten = useCallback(async (newFilter?: ListOpdrachtQuery) => {
    setLoading(true);
    const result = await listOpdrachten(newFilter || filter);

    // Sort by rate if selected
    if (sortBy === "rate") {
      result.sort((a, b) => {
        const maxA = a.uurtarief_max || a.uurtarief_min || 0;
        const maxB = b.uurtarief_max || b.uurtarief_min || 0;
        return maxB - maxA;
      });
    }

    setOpdrachten(result);
    setLoading(false);
  }, [filter, sortBy]);

  useEffect(() => {
    loadOpdrachten();
  }, [sortBy]);

  const handleFilterChange = async (newFilter: ListOpdrachtQuery) => {
    setFilter(newFilter);
    setLoading(true);
    const result = await listOpdrachten(newFilter);

    if (sortBy === "rate") {
      result.sort((a, b) => {
        const maxA = a.uurtarief_max || a.uurtarief_min || 0;
        const maxB = b.uurtarief_max || b.uurtarief_min || 0;
        return maxB - maxA;
      });
    }

    setOpdrachten(result);
    setLoading(false);
  };

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchInput(value);
      setLoading(true);
      const result = await listOpdrachten({
        ...filter,
        search: value || undefined,
      });
      setOpdrachten(result);
      setLoading(false);
    },
    [filter]
  );

  const addTag = (tag: string) => {
    const cleaned = tag.trim().toLowerCase();
    if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const shareOnWhatsApp = (job: any) => {
    const url = `${window.location.origin}/opdracht/${job.id}`;
    const text = `🚀 Check deze opdracht op ViaVia!\n\n${job.titel}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setFormLoading(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);

      const data: CreateOpdracht = {
        titel: formData.get("titel") as string,
        omschrijving: formData.get("omschrijving") as string,
        locatie: locatie,
        plaats: formData.get("plaats") as string | undefined,
        hybride_dagen_per_week: locatie === "Hybride"
          ? parseInt(formData.get("hybride_dagen") as string) || undefined
          : undefined,
        uurtarief_min: formData.get("uurtarief_min")
          ? parseInt(formData.get("uurtarief_min") as string) * 100
          : undefined,
        uurtarief_max: formData.get("uurtarief_max")
          ? parseInt(formData.get("uurtarief_max") as string) * 100
          : undefined,
        valuta: (formData.get("valuta") as string) || "EUR",
        startdatum: formData.get("startdatum") as string | undefined,
        duur: formData.get("duur") as string | undefined,
        inzet: formData.get("inzet") as string | undefined,
        tags: tags.length > 0 ? tags : undefined,
        plaatser_naam: formData.get("plaatser_naam") as string,
        plaatser_whatsapp: formData.get("plaatser_whatsapp") as string,
      };

      const result = await createOpdracht(data);

      if (result.success) {
        setSuccess(true);
        setTags([]);
        setTagInput("");
        if (form) form.reset();
        await loadOpdrachten();
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 2000);
      } else {
        setError(result.error || "Er is iets misgegaan");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Fout bij plaatsen opdracht");
    }
    setFormLoading(false);
  }

  // Get all unique tags from opdrachten for quick filters
  const allTags = Array.from(
    new Set(
      opdrachten
        .filter((job) => job.tags)
        .flatMap((job) => JSON.parse(job.tags))
    )
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container-main">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                ViaVia
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Freelance opdrachten, direct gedeeld
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input text-sm py-2 px-3 bg-gray-800 border-gray-700"
              >
                <option value="recent">🕒 Nieuwste eerst</option>
                <option value="oldest">📅 Oudste eerst</option>
                <option value="rate">💰 Hoogste tarief</option>
              </select>

              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? "← Terug" : "+ Nieuwe opdracht"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main">
        <div className="split-layout py-6">
          {/* Left: Form or Filters */}
          <div className="split-left">
            {!showForm ? (
              <div className="space-y-4 animate-slide-in">
                {/* Search */}
                <div className="glass rounded-xl p-4">
                  <input
                    type="text"
                    placeholder="🔍 Zoeken op titel of skill..."
                    className="input"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                {/* Quick Tag Filters */}
                {allTags.length > 0 && (
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      🏷️ Populaire Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleSearch(tag)}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="glass rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Filters
                  </h3>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange({ ...filter, status: "OPEN" })}
                        className={`btn text-sm ${
                          filter.status === "OPEN" ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        🟢 Open
                      </button>
                      <button
                        onClick={() => handleFilterChange({ ...filter, status: "INGEVULD" })}
                        className={`btn text-sm ${
                          filter.status === "INGEVULD" ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        ✓ Ingevuld
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Locatie</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange({ ...filter, locatie: "Remote" })}
                        className={`btn text-sm ${
                          filter.locatie === "Remote" ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        🌐 Remote
                      </button>
                      <button
                        onClick={() => handleFilterChange({ ...filter, locatie: undefined })}
                        className={`btn text-sm ${
                          !filter.locatie ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        📍 Alles
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {opdrachten.length}
                      </p>
                      <p className="text-xs text-gray-400">
                        {filter.status === "OPEN" ? "Open opdrachten" : "Ingevulde opdrachten"}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-2xl">💼</span>
                    </div>
                  </div>
                </div>

                {/* Bookmarked */}
                {bookmarked.size > 0 && (
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-emerald-400">
                          {bookmarked.size}
                        </p>
                        <p className="text-xs text-gray-400">
                          Opgeslagen opdrachten
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass rounded-xl p-6 animate-slide-in max-h-[calc(100vh-120px)] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Nieuwe opdracht plaatsen</h2>

                {success && (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 mb-4 text-emerald-400">
                    ✓ Opdracht succesvol geplaatst!
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      📝 Titel *
                    </label>
                    <input
                      type="text"
                      name="titel"
                      className="input"
                      placeholder="React Expert gezocht"
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      📄 Omschrijving *
                    </label>
                    <textarea
                      name="omschrijving"
                      className="textarea"
                      placeholder="Beschrijf de opdracht..."
                      required
                      disabled={formLoading}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      📍 Locatie *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Remote", "OnSite", "Hybride"].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocatie(loc as any)}
                          disabled={formLoading}
                          className={`btn text-sm ${
                            locatie === loc ? "btn-primary" : "btn-outline"
                          }`}
                        >
                          {loc === "Remote" && "🌐"}
                          {loc === "OnSite" && "📍"}
                          {loc === "Hybride" && "🏢"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {locatie !== "Remote" && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Plaats *
                      </label>
                      <input
                        type="text"
                        name="plaats"
                        className="input"
                        placeholder="Amsterdam"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      💰 Uurtarief (optioneel)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="uurtarief_min"
                        className="input"
                        placeholder="Min"
                        disabled={formLoading}
                      />
                      <input
                        type="number"
                        name="uurtarief_max"
                        className="input"
                        placeholder="Max"
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      #️⃣ Skills (max 5)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(tagInput);
                          }
                        }}
                        className="input flex-1"
                        placeholder="React, TypeScript..."
                        disabled={formLoading}
                      />
                      <button
                        type="button"
                        onClick={() => addTag(tagInput)}
                        className="btn btn-secondary"
                        disabled={formLoading}
                      >
                        +
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center gap-2 ring-1 ring-emerald-500/30"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              disabled={formLoading}
                              className="hover:text-red-400"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <h3 className="font-semibold mb-3 text-gray-300">Jouw gegevens</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          👤 Naam *
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
                          📱 WhatsApp *
                        </label>
                        <input
                          type="text"
                          name="plaatser_whatsapp"
                          className="input"
                          placeholder="+31612345678"
                          required
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full text-base py-3"
                    disabled={formLoading}
                  >
                    {formLoading ? "Plaatsen..." : "✓ Opdracht plaatsen"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right: Job Tiles */}
          <div className="split-right">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                Laden...
              </div>
            ) : opdrachten.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400">Geen opdrachten gevonden</p>
              </div>
            ) : (
              opdrachten.map((job, index) => {
                const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                const isBookmarked = bookmarked.has(job.id);

                return (
                  <div
                    key={job.id}
                    className={`job-tile ${job.status === "INGEVULD" ? "job-tile-filled" : ""} animate-slide-in relative group`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* New Badge */}
                    {isNew && job.status === "OPEN" && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ NIEUW
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(job.id);
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-2xl hover:scale-110 transform"
                    >
                      {isBookmarked ? "⭐" : "☆"}
                    </button>

                    <Link href={`/opdracht/${job.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="job-title text-lg font-semibold text-white flex-1 pr-8">
                          {job.titel}
                        </h3>
                        <span className={`badge ${job.status === "OPEN" ? "badge-open" : "badge-filled"}`}>
                          {job.status === "OPEN" ? "🟢 Open" : "✓ Ingevuld"}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {job.omschrijving}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>
                          {job.locatie === "Remote" && "🌐 Remote"}
                          {job.locatie === "OnSite" && `📍 ${job.plaats || "On-site"}`}
                          {job.locatie === "Hybride" && "🏢 Hybride"}
                        </span>
                        {(job.uurtarief_min || job.uurtarief_max) && (
                          <span className="text-emerald-400 font-semibold">
                            💰 €{Math.max(job.uurtarief_min || 0, job.uurtarief_max || 0) / 100}/u
                          </span>
                        )}
                        {job._count?.reacties > 0 && (
                          <span>💬 {job._count.reacties}</span>
                        )}
                        <span className="ml-auto">
                          {new Date(job.created_at).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>

                      {job.tags && JSON.parse(job.tags).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(job.tags).slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Quick Actions */}
                    <div className="mt-3 pt-3 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          shareOnWhatsApp(job);
                        }}
                        className="btn btn-outline text-xs py-1.5 w-full"
                      >
                        💬 Deel via WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
