"use client";

import { createOpdracht, CreateOpdracht } from "@/app/actions/opdracht";
import { listOpdrachten } from "@/app/actions/queries";
import OpdrachtenList from "@/app/components/OpdrachtenList";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NieuwOpdrachPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locatie, setLocatie] = useState<"Remote" | "OnSite" | "Hybride">(
    "Remote"
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    loadOpdrachten();
  }, []);

  const loadOpdrachten = async () => {
    setListLoading(true);
    const result = await listOpdrachten({ status: "OPEN", sort: "recent" });
    setOpdrachten(result);
    setListLoading(false);
  };

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
    setSuccess(false);
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
      setSuccess(true);
      setTags([]);
      setTagInput("");
      (e.currentTarget as HTMLFormElement).reset();
      await loadOpdrachten();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(result.error || "Er is iets misgegaan");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <button className="btn btn-outline mb-4">← Terug</button>
          </Link>
          <h1 className="text-3xl font-bold">✏️ Nieuwe Opdracht</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-120px)]">
        <div className="border-r border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="max-w-md">
            {success && (
              <div className="card bg-green-50 border-green-200 mb-4 text-green-800">
                ✓ Opdracht succesvol geplaatst!
              </div>
            )}

            {error && (
              <div className="card bg-red-50 border-red-200 mb-4 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  📝 Opdrachtitle *
                </label>
                <input
                  type="text"
                  name="titel"
                  className="input"
                  placeholder="React Expert needed"
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  📄 Omschrijving *
                </label>
                <textarea
                  name="omschrijving"
                  className="textarea"
                  placeholder="Wat moet er gedaan worden?"
                  required
                  disabled={loading}
                  maxLength={1000}
                  rows={4}
                />
              </div>

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
                      disabled={loading}
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
                  <label className="block text-sm font-semibold mb-2">
                    Plaats *
                  </label>
                  <input
                    type="text"
                    name="plaats"
                    className="input"
                    placeholder="Amsterdam"
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {locatie === "Hybride" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Dagen per week *
                  </label>
                  <select name="hybride_dagen" className="input" required disabled={loading}>
                    <option value="">Selecteer...</option>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>
                        {d} dag{d > 1 ? "en" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  💰 Uurtarief
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    name="uurtarief_min"
                    className="input"
                    placeholder="Min"
                    min={0}
                    disabled={loading}
                  />
                  <input
                    type="number"
                    name="uurtarief_max"
                    className="input"
                    placeholder="Max"
                    min={0}
                    disabled={loading}
                  />
                </div>
                <select name="valuta" className="input" disabled={loading}>
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="btn btn-secondary"
                    disabled={loading}
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
                          disabled={loading}
                          className="hover:text-red-600"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-5">
                <h3 className="font-semibold mb-4">Jouw gegevens</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    👤 Naam *
                  </label>
                  <input
                    type="text"
                    name="plaatser_naam"
                    className="input"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    📱 WhatsApp *
                  </label>
                  <input
                    type="text"
                    name="plaatser_whatsapp"
                    className="input"
                    placeholder="+31612345678"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg py-3 mt-6"
                disabled={loading}
              >
                {loading ? "Plaatsen..." : "✓ Plaatsen"}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-50 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h2 className="text-xl font-bold mb-4">📋 Open opdrachten</h2>
          
          {listLoading ? (
            <div className="text-center py-8 text-gray-500">
              Laden...
            </div>
          ) : opdrachten.length > 0 ? (
            <OpdrachtenList opdrachten={opdrachten} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nog geen opdrachten
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
