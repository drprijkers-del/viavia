"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        }),
      });

      if (!res.ok) throw new Error("Failed to create job");

      const { job } = await res.json();
      router.push(`/dashboard/jobs/${job.id}/share`);
    } catch (error) {
      console.error("Error:", error);
      alert("Kon opdracht niet aanmaken");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              className="btn btn-primary w-full py-4"
            >
              {loading ? "Bezig..." : "Volgende: Deel in groepen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
