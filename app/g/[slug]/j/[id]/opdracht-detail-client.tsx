"use client";

import { useState } from "react";
import Link from "next/link";
import { createWhatsAppLink } from "@/lib/utils";
import ViaViaLogo from "@/app/components/ViaViaLogo";

interface OpdrachtDetailClientProps {
  opdracht: any;
  slug: string;
}

export default function OpdrachtDetailClient({ opdracht, slug }: OpdrachtDetailClientProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);

  const whatsappLink = createWhatsAppLink(
    opdracht.plaatser_whatsapp,
    `Hey ${opdracht.plaatser_naam}! Ik ben geïnteresseerd in de opdracht "${opdracht.titel}" bij ${opdracht.bedrijf}. Kunnen we hierover praten?`
  );

  const isFilled = opdracht.status === "INGEVULD";

  const description = opdracht.omschrijving || "";
  const shouldTruncate = description.length > 200;
  const displayDescription = showExpanded || !shouldTruncate
    ? description
    : description.substring(0, 200) + "...";

  function shareOpdracht() {
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
    <div className="app-frame">
      <div className="app-container pb-24">
        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in">
              <h2 className="text-xl font-semibold text-white mb-2">
                Opdracht gedeeld!
              </h2>
              <p className="text-secondary mb-6">
                De link is gekopieerd. Deel deze met anderen zodat zij deze opdracht kunnen importeren.
              </p>
              <button
                onClick={() => setShowShareModal(false)}
                className="btn btn-primary w-full"
              >
                Sluiten
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <ViaViaLogo size="sm" href="/" />
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center justify-between">
            <Link href={`/g/${slug}`}>
              <button className="text-sm text-secondary hover:text-white transition-colors">
                ← Terug
              </button>
            </Link>
            <button
              onClick={shareOpdracht}
              className="text-sm text-accent hover:opacity-80 transition-opacity"
              title="Deel opdracht"
            >
              Deel
            </button>
          </div>
        </div>

        {/* Detail Card */}
        <div className="card">
          {/* Title Block */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-1 leading-tight ${isFilled ? "line-through text-tertiary" : "text-white"}`}>
              {opdracht.titel}
            </h1>
            <p className="text-lg text-secondary mb-3">{opdracht.bedrijf}</p>
            <div className="flex items-center gap-2">
              {opdracht.group && (
                <Link href={`/g/${opdracht.group.slug}`}>
                  <span className="badge badge-open text-xs">
                    {opdracht.group.name || "ViaVia"}
                  </span>
                </Link>
              )}
              {isFilled && (
                <span className="badge badge-filled text-xs">
                  ✓ Ingevuld
                </span>
              )}
            </div>
          </div>

          {/* Key Facts - Single Row */}
          <div className="mb-6 pb-6 border-b border-[#3A3A3C]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-accent font-semibold">€{opdracht.uurtarief}/uur</span>
              </div>
              <span className="text-tertiary">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white">
                  {opdracht.locatie === "Remote" && "Remote"}
                  {opdracht.locatie === "Hybride" && "Hybride"}
                  {opdracht.locatie === "OnSite" && "Op locatie"}
                  {opdracht.locatie_detail && ` (${opdracht.locatie_detail})`}
                </span>
              </div>
              {opdracht.uren_per_week && (
                <>
                  <span className="text-tertiary">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white">{opdracht.uren_per_week}u/week</span>
                  </div>
                </>
              )}
              {opdracht.duur_maanden && (
                <>
                  <span className="text-tertiary">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white">{opdracht.duur_maanden} mnd</span>
                  </div>
                </>
              )}
              {opdracht.teamgrootte && (
                <>
                  <span className="text-tertiary">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-white">{opdracht.teamgrootte}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-secondary text-sm mb-2">Omschrijving</h3>
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </p>
            {shouldTruncate && !showExpanded && (
              <button
                onClick={() => setShowExpanded(true)}
                className="text-accent text-sm mt-2 hover:opacity-80"
              >
                Meer lezen
              </button>
            )}
          </div>

          {/* Contact */}
          <div className="pt-6 border-t border-[#3A3A3C] mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white font-bold">
                {opdracht.plaatser_naam?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-tertiary text-xs">Geplaatst door</p>
                <p className="text-white font-medium">{opdracht.plaatser_naam}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          {!isFilled ? (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
              <button className="btn btn-primary w-full text-base py-4">
                💬 Reageer via WhatsApp
              </button>
            </a>
          ) : (
            <div className="text-center py-4 text-tertiary">
              Deze opdracht is ingevuld
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
