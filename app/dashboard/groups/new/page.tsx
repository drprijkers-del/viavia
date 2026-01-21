"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create group");

      const { group } = await res.json();
      router.push(`/dashboard/groups/${group.slug}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Kon groep niet aanmaken");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ViaViaLogo size="sm" />
        <Link href="/dashboard">
          <button className="text-sm text-muted hover:text-white transition-colors">
            ← Terug
          </button>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Nieuwe groep</h1>
      <p className="text-muted mb-6">
        Maak een groep aan voor je WhatsApp-groep
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <label className="block text-sm text-muted mb-2">
            Groepsnaam
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bijv. Freelance Devs Amsterdam"
            required
            className="input"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Bezig..." : "Maak groep aan"}
        </button>
      </form>
    </div>
  );
}
