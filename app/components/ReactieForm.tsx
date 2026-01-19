"use client";

import { createReactie } from "@/app/actions/opdracht";
import { useState } from "react";

export default function ReactieForm({ opdrachtId }: { opdrachtId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const naam = formData.get("naam") as string;
    const bericht = formData.get("bericht") as string;
    const whatsapp = formData.get("whatsapp") as string;

    const result = await createReactie(opdrachtId, {
      naam,
      bericht: bericht || undefined,
      whatsapp_nummer: whatsapp || undefined,
    });

    if (result.success) {
      setMessage("✅ Je reactie is geplaatst!");
      e.currentTarget.reset();
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Je naam *</label>
        <input
          type="text"
          name="naam"
          className="input"
          placeholder="Bijv. Jan Jansen"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Kort bericht (optioneel)
        </label>
        <textarea
          name="bericht"
          className="textarea"
          placeholder="Bijv. Ik heb ervaring met React..."
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          WhatsApp nummer (optioneel)
        </label>
        <input
          type="tel"
          name="whatsapp"
          className="input"
          placeholder="+31 6 12 34 56 78"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Verzenden..." : "Reactie plaatsen"}
      </button>
    </form>
  );
}
