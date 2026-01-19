"use client";

import { useState } from "react";

export default function ShareButton({
  opdrachtId,
  titel,
}: {
  opdrachtId: string;
  titel: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/opdracht/${opdrachtId}`;
  const shareText = `Check deze freelance opdracht: "${titel}"\n\n${shareUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ViaVia Opdracht",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn btn-secondary w-full"
      title="Deel deze opdracht"
    >
      {copied ? "✅ Gekopieerd!" : "🔗 Deel in WhatsApp"}
    </button>
  );
}
