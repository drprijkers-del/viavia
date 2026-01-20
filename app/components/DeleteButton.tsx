"use client";

import { useState } from "react";
import { deleteOpdracht } from "@/app/actions/delete";
import { useRouter } from "next/navigation";

export default function DeleteButton({ opdrachtId }: { opdrachtId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    // Get edit token from localStorage
    const editToken = localStorage.getItem(`edit_token_${opdrachtId}`);

    if (!editToken) {
      alert("Je bent niet geautoriseerd om deze opdracht te verwijderen");
      setLoading(false);
      setShowConfirm(false);
      return;
    }

    const result = await deleteOpdracht(opdrachtId, editToken);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      alert(result.error || "Fout bij verwijderen");
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // Only show button if user has edit token
  const editToken = typeof window !== "undefined" ? localStorage.getItem(`edit_token_${opdrachtId}`) : null;

  if (!editToken) return null;

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-6 max-w-md w-full border border-red-500/30 shadow-2xl animate-slide-in">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Opdracht verwijderen?
            </h2>
            <p className="text-gray-400 text-sm">
              Deze actie kan niet ongedaan worden gemaakt
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn bg-red-600 hover:bg-red-500 text-white w-full py-3"
            >
              {loading ? "Bezig..." : "🗑️ Ja, verwijder definitief"}
            </button>

            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="btn btn-outline w-full"
            >
              Annuleer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="btn bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 w-full mt-3"
    >
      🗑️ Verwijder opdracht
    </button>
  );
}
