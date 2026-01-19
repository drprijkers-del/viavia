"use client";

import { useState } from "react";
import { createKandidaat, CreateKandidaat } from "@/app/actions/kandidaat";
import Link from "next/link";

export default function KandidatenPage() {
  const [formData, setFormData] = useState({
    naam: "",
    hoofdskill: "",
    skills: "",
    whatsapp_nummer: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data: CreateKandidaat = {
      naam: formData.naam,
      hoofdskill: formData.hoofdskill,
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
      whatsapp_nummer: formData.whatsapp_nummer,
    };

    const result = await createKandidaat(data);

    if (result.success) {
      setMessage("✅ Kandidaat toegevoegd!");
      setFormData({ naam: "", hoofdskill: "", skills: "", whatsapp_nummer: "" });
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 flex flex-col items-center">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl w-full">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Kandidaten Beheer
            </h1>
            <Link href="/">
              <button className="btn btn-outline">← Terug</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-5 sm:px-6 py-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Nieuwe kandidaat toevoegen</h2>

          {message && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.startsWith("✅")
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                👤 Naam *
              </label>
              <input
                type="text"
                value={formData.naam}
                onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                className="input"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                💼 Hoofdskill *
              </label>
              <input
                type="text"
                value={formData.hoofdskill}
                onChange={(e) => setFormData({ ...formData, hoofdskill: e.target.value })}
                className="input"
                placeholder="React Developer"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                ⚡ Skills (komma gescheiden)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="input"
                placeholder="React, TypeScript, Next.js"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Bijvoorbeeld: React, TypeScript, Next.js
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                📱 WhatsApp nummer *
              </label>
              <input
                type="tel"
                value={formData.whatsapp_nummer}
                onChange={(e) => setFormData({ ...formData, whatsapp_nummer: e.target.value })}
                className="input"
                placeholder="+31612345678"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-4"
              disabled={loading}
            >
              {loading ? "Bezig..." : "✓ Kandidaat toevoegen"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">💡 Tips:</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Kandidaten met matching skills worden automatisch gemarkeerd bij opdrachten</li>
              <li>• De sidebar is alleen zichtbaar op desktop (grote schermen)</li>
              <li>• Skills worden gebruikt voor smart matching met opdrachten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
