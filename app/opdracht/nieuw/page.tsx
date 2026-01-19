"use client";

import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";
import { useState } from "react";
import Link from "next/link";

export default function NieuwOpdrachPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locatie, setLocatie] = useState<"Remote" | "OnSite" | "Hybride">(
    "Remote"
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

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
      // Success: redirect to detail page with edit token
      const tokenUrl = `/opdracht/${result.opdrachtId}?token=${data.plaatser_whatsapp}`;
      window.location.href = tokenUrl;
    } else {
      setError(result.error || "Er is iets misgegaan");
      setLoading(false);
    }
  }

  return (
    <div className="container-main">
      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <button className="btn btn-outline mb-4">← Terug</button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">✏️ Nieuwe Opdracht</h1>
        <p className="text-gray-600">
          Plaats je freelance opdracht in max 2 minuten
        </p>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titel */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            📝 Opdrachtitle *
          </label>
          <input
            type="text"
            name="titel"
            className="input"
            placeholder="Bijv. React Expert needed"
            required
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">Max 100 tekens</p>
        </div>

        {/* Omschrijving */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            📄 Omschrijving *
          </label>
          <textarea
            name="omschrijving"
            className="textarea"
            placeholder="Wat moet er precies gedaan worden? Wat zijn je vereisten?"
            required
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">Max 1000 tekens</p>
        </div>

        {/* Locatie */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            📍 Locatie *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Remote", "OnSite", "Hybride"].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() =>
                  setLocatie(loc as "Remote" | "OnSite" | "Hybride")
                }
                className={`btn ${
                  locatie === loc ? "btn-primary" : "btn-outline"
                }`}
              >
                {loc === "Remote" && "🌐 Remote"}
                {loc === "OnSite" && "📍 On-site"}
                {loc === "Hybride" && "🏢 Hybride"}
              </button>
            ))}
          </div>
        </div>

        {/* Plaats (if OnSite/Hybride) */}
        {locatie !== "Remote" && (
          <div>
            <label className="block text-sm font-semibold mb-2">
              📌 Plaats/Stad *
            </label>
            <input
              type="text"
              name="plaats"
              className="input"
              placeholder="Bijv. Amsterdam"
              required
            />
          </div>
        )}

        {/* Hybride dagen (if Hybride) */}
        {locatie === "Hybride" && (
          <div>
            <label className="block text-sm font-semibold mb-2">
              📅 Dagen per week *
            </label>
            <select name="hybride_dagen" className="input" required>
              <option value="">Selecteer...</option>
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} dag{d > 1 ? "en" : ""} per week
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tarief */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            💰 Uurtarief (optioneel)
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="number"
              name="uurtarief_min"
              className="input"
              placeholder="Min (bijv. 50)"
              min={0}
            />
            <input
              type="number"
              name="uurtarief_max"
              className="input"
              placeholder="Max (bijv. 75)"
              min={0}
            />
          </div>
          <select name="valuta" className="input">
            <option value="EUR">€ EUR</option>
            <option value="USD">$ USD</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        {/* Startdatum */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            🚀 Startdatum (optioneel)
          </label>
          <input
            type="text"
            name="startdatum"
            className="input"
            placeholder="Bijv. ASAP, 2026-02-01"
          />
        </div>

        {/* Duur */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            ⏱️ Duur (optioneel)
          </label>
          <input
            type="text"
            name="duur"
            className="input"
            placeholder="Bijv. 3 maanden, 6 weken"
          />
        </div>

        {/* Inzet */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            💼 Inzet (optioneel)
          </label>
          <input
            type="text"
            name="inzet"
            className="input"
            placeholder="Bijv. 20 uur/week, 0.5 FTE"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            #️⃣ Skills/Tags (max 5)
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
              placeholder="Bijv. React, TypeScript"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Plaatser Info */}
        <div className="border-t pt-5">
          <h3 className="text-lg font-semibold mb-4">Jouw gegevens</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              👤 Naam *
            </label>
            <input
              type="text"
              name="plaatser_naam"
              className="input"
              placeholder="Bijv. Jan Jansen"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              📱 WhatsApp Nummer *
            </label>
            <input
              type="tel"
              name="plaatser_whatsapp"
              className="input"
              placeholder="+31 6 12 34 56 78"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: +31612345678 of 0612345678
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg py-3 mt-6"
        >
          {loading ? "Plaatsen..." : "🚀 Opdracht plaatsen"}
        </button>
      </form>
    </div>
  );
}
