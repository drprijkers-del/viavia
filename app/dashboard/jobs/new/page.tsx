"use client";

import { useState, useEffect } from "react";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

type SavedJob = {
  id: string;
  title: string;
  company: string;
  rate: number;
  locationType: string;
  shares?: { group: { name: string; slug: string } }[];
};

type Group = {
  id: string;
  name: string;
  slug: string;
  _count: { jobShares: number };
};

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [savedJob, setSavedJob] = useState<SavedJob | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    rate: "",
    locationType: "Remote",
    locationDetail: "",
    hoursPerWeek: "",
    months: "",
    teamSize: "",
    posterName: "",
    posterWhatsapp: "",
  });

  // Load user's groups
  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await fetch("/api/groups/my");
        if (res.ok) {
          const data = await res.json();
          setGroups(data.groups);
          // Pre-select the first group
          if (data.groups.length > 0) {
            setSelectedGroupIds([data.groups[0].id]);
          }
        }
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    }
    loadGroups();
  }, []);

  function toggleGroup(groupId: string) {
    setSelectedGroupIds(prev => {
      if (prev.includes(groupId)) {
        // Don't allow deselecting if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== groupId);
      }
      return [...prev, groupId];
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedGroupIds.length === 0) {
      alert("Selecteer minimaal één groep");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rate: parseInt(formData.rate),
          hoursPerWeek: formData.hoursPerWeek ? parseInt(formData.hoursPerWeek) : null,
          months: formData.months ? parseInt(formData.months) : null,
          groupIds: selectedGroupIds,
        }),
      });

      if (!res.ok) throw new Error("Failed to create job");

      const { job } = await res.json();
      setSavedJob(job);
    } catch (error) {
      console.error("Error:", error);
      alert("Kon opdracht niet aanmaken");
    } finally {
      setLoading(false);
    }
  }

  // Success state - job is saved
  if (savedJob) {
    const sharedGroupNames = savedJob.shares?.map(s => s.group.name).join(", ") || "";

    return (
      <div className="app-frame">
        <div className="app-container pb-24">
          <div className="flex items-center justify-between mb-8 mt-6">
            <ViaViaLogo size="sm" />
            <Link href="/dashboard">
              <button className="text-sm text-muted hover:text-white transition-colors">
                ← Dashboard
              </button>
            </Link>
          </div>

          <div className="max-w-md mx-auto text-center">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Opdracht opgeslagen!</h1>
            <p className="text-muted mb-2">
              {savedJob.title} bij {savedJob.company} is succesvol aangemaakt.
            </p>
            {sharedGroupNames && (
              <p className="text-sm text-accent mb-8">
                Gedeeld in: {sharedGroupNames}
              </p>
            )}

            <div className="card mb-6 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{savedJob.title}</h3>
                  <p className="text-sm text-muted">{savedJob.company}</p>
                </div>
                <span className="text-accent font-semibold">€{savedJob.rate}/uur</span>
              </div>
              <p className="text-sm text-muted mt-2">{savedJob.locationType}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const message = `💼 *${savedJob.title}*\n🏢 ${savedJob.company}\n\n💰 €${savedJob.rate}/uur\n📍 ${savedJob.locationType}\n\n🔗 Bekijk: ${window.location.origin}/dashboard/jobs/${savedJob.id}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="btn btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Deel in WhatsApp
              </button>
              <Link href="/dashboard">
                <button className="btn btn-secondary w-full">
                  Terug naar dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" />
          <Link href="/dashboard">
            <button className="text-sm text-muted hover:text-white transition-colors">
              ← Dashboard
            </button>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Nieuwe opdracht</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Group Selection */}
            <div className="card">
              <label className="block text-sm text-muted mb-3">Deel in groepen *</label>
              {loadingGroups ? (
                <p className="text-sm text-tertiary">Laden...</p>
              ) : groups.length === 0 ? (
                <div>
                  <p className="text-sm text-tertiary mb-3">Je hebt nog geen groepen</p>
                  <Link href="/dashboard/groups/new">
                    <button type="button" className="btn btn-secondary text-sm">
                      + Maak een groep
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {groups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full p-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                        selectedGroupIds.includes(group.id)
                          ? "border-accent bg-accent/10"
                          : "border-border bg-bg hover:border-muted"
                      }`}
                    >
                      <span className={selectedGroupIds.includes(group.id) ? "text-white" : "text-muted"}>
                        {group.name}
                      </span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedGroupIds.includes(group.id)
                          ? "bg-accent border-accent"
                          : "border-muted"
                      }`}>
                        {selectedGroupIds.includes(group.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Functie *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="bijv. Senior React Developer"
                required
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Bedrijf *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="bijv. Coolblue"
                required
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Omschrijving *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Beschrijf de opdracht in 2-3 zinnen..."
                required
                rows={3}
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Uurtarief (€) *</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="100"
                required
                min="0"
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Locatie *</label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="input"
              >
                <option value="Remote">Remote</option>
                <option value="Hybride">Hybride</option>
                <option value="OnSite">Op locatie</option>
              </select>
              {(formData.locationType === "Hybride" || formData.locationType === "OnSite") && (
                <input
                  type="text"
                  name="locationDetail"
                  value={formData.locationDetail}
                  onChange={handleChange}
                  placeholder="bijv. Amsterdam"
                  className="input mt-2"
                />
              )}
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Uren per week</label>
              <input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                placeholder="32"
                min="0"
                max="40"
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Duur (maanden)</label>
              <input
                type="number"
                name="months"
                value={formData.months}
                onChange={handleChange}
                placeholder="6"
                min="0"
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Teamgrootte</label>
              <input
                type="text"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="bijv. 2-5 of 10+"
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">Jouw naam *</label>
              <input
                type="text"
                name="posterName"
                value={formData.posterName}
                onChange={handleChange}
                placeholder="bijv. Jan Jansen"
                required
                className="input"
              />
            </div>

            <div className="card">
              <label className="block text-sm text-muted mb-2">WhatsApp nummer *</label>
              <input
                type="tel"
                name="posterWhatsapp"
                value={formData.posterWhatsapp}
                onChange={handleChange}
                placeholder="+31612345678"
                required
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || selectedGroupIds.length === 0}
              className="btn btn-primary w-full py-4"
            >
              {loading ? "Opslaan..." : `Opslaan in ${selectedGroupIds.length} ${selectedGroupIds.length === 1 ? "groep" : "groepen"}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
