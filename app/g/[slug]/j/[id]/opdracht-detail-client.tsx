"use client";

import { useState } from "react";
import Link from "next/link";
import { createWhatsAppLink } from "@/lib/utils";

interface OpdrachtDetailClientProps {
  opdracht: any;
  slug: string;
}

export default function OpdrachtDetailClient({ opdracht, slug }: OpdrachtDetailClientProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const whatsappLink = createWhatsAppLink(
    opdracht.plaatser_whatsapp,
    `Hey ${opdracht.plaatser_naam}! Ik ben geïnteresseerd in de opdracht "${opdracht.titel}" bij ${opdracht.bedrijf}. Kunnen we hierover praten?`
  );

  const isFilled = opdracht.status === "INGEVULD";

  function shareOpdracht() {
    // Create shareable opdracht data (without sensitive info like edit_token)
    const opdrachtData = {
      titel: opdracht.titel,
      bedrijf: opdracht.bedrijf,
      omschrijving: opdracht.omschrijving,
      uurtarief: opdracht.uurtarief,
      locatie: opdracht.locatie,
      locatie_detail: opdracht.locatie_detail,
      uren_per_week: opdracht.uren_per_week,
      duur_maanden: opdracht.duur_maanden,
      teamgrootte: opdracht.teamgrootte,
      plaatser_naam: opdracht.plaatser_naam,
      plaatser_whatsapp: opdracht.plaatser_whatsapp,
    };

    const encoded = btoa(JSON.stringify(opdrachtData));
    const shareUrl = `${window.location.origin}/import-opdracht?data=${encoded}`;

    // Create a nice WhatsApp message with job details
    const locationText = opdracht.locatie === "Remote" ? "Remote" : opdracht.locatie === "Hybride" ? "Hybride" : "Op locatie";
    const description = opdracht.omschrijving.length > 120
      ? opdracht.omschrijving.substring(0, 120) + "..."
      : opdracht.omschrijving;

    const whatsappMessage = `💼 *${opdracht.titel}*
🏢 ${opdracht.bedrijf}

📋 ${description}

💰 €${opdracht.uurtarief}/uur ${opdracht.uren_per_week ? `• ${opdracht.uren_per_week} uur/week` : ''}
📍 ${locationText}${opdracht.duur_maanden ? ` • ${opdracht.duur_maanden} maanden` : ''}

🔗 Importeer in ViaVia:
${shareUrl}`;

    if (confirm("Wil je deze opdracht delen via WhatsApp?")) {
      window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowShareModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Opdracht gedeeld!
            </h2>
            <p className="text-gray-400 mb-6">
              De link is gekopieerd. Deel deze met anderen zodat zij deze opdracht kunnen importeren in hun eigen groepen.
            </p>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}

      {/* Simple header */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/g/${slug}`}>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Terug
            </button>
          </Link>
          <button
            onClick={shareOpdracht}
            className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1"
            title="Deel opdracht"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Deel
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Summary card - WhatsApp style */}
        <div className="bg-[#1A1A1A] border border-gray-800/50 rounded-2xl p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isFilled ? "line-through text-gray-600" : "text-white"}`}>
              {opdracht.titel}
            </h1>
            <p className="text-xl text-gray-400">{opdracht.bedrijf}</p>
            {opdracht.group && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Geplaatst in:</span>
                <Link href={`/g/${opdracht.group.slug}`}>
                  <span className="text-xs bg-emerald-600/10 text-emerald-400 px-3 py-1.5 rounded-full hover:bg-emerald-600/20 transition-colors">
                    {opdracht.group.name || "ViaVia"}
                  </span>
                </Link>
              </div>
            )}
            {isFilled && (
              <span className="inline-block mt-3 text-xs bg-gray-800 text-gray-500 px-3 py-1.5 rounded-full">
                ✓ Ingevuld
              </span>
            )}
          </div>

          {/* Key info - inline summary style */}
          <div className="space-y-4 mb-8 pb-8 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-32">Locatie:</span>
              <span className="text-white">
                {opdracht.locatie === "Remote" && "Remote"}
                {opdracht.locatie === "Hybride" && "Hybride"}
                {opdracht.locatie === "OnSite" && "Op locatie"}
                {opdracht.locatie_detail && ` · ${opdracht.locatie_detail}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-32">Uurtarief:</span>
              <span className="text-emerald-400 font-semibold text-lg">
                €{opdracht.uurtarief}/uur
              </span>
            </div>

            {opdracht.uren_per_week && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32">Uren per week:</span>
                <span className="text-white">{opdracht.uren_per_week}</span>
              </div>
            )}

            {opdracht.duur_maanden && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32">Duur:</span>
                <span className="text-white">{opdracht.duur_maanden} maanden</span>
              </div>
            )}

            {opdracht.teamgrootte && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32">Teamgrootte:</span>
                <span className="text-white">{opdracht.teamgrootte}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-gray-500 text-sm mb-3">Omschrijving</h3>
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {opdracht.omschrijving}
            </p>
          </div>

          {/* Contact info */}
          <div className="pt-6 border-t border-gray-800/50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold">
                {opdracht.plaatser_naam?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-gray-500 text-xs">Geplaatst door</p>
                <p className="text-white font-medium">{opdracht.plaatser_naam}</p>
              </div>
            </div>
          </div>

          {/* Single CTA - WhatsApp */}
          {!isFilled && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-4 rounded-xl transition-all text-base">
                💬 Reageer via WhatsApp
              </button>
            </a>
          )}

          {isFilled && (
            <div className="text-center py-4 text-gray-600">
              Deze opdracht is ingevuld
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
