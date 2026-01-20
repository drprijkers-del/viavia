import { getOpdracht } from "@/app/actions/queries";
import { createWhatsAppLink } from "@/lib/utils";
import Link from "next/link";

export default async function OpdrachtDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const opdracht = await getOpdracht(id);

  if (!opdracht) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Opdracht niet gevonden
          </h2>
          <Link href={`/g/${slug}`}>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-colors">
              ← Terug
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const whatsappLink = createWhatsAppLink(
    opdracht.plaatser_whatsapp,
    `Hey ${opdracht.plaatser_naam}! Ik ben geïnteresseerd in de opdracht "${opdracht.titel}" bij ${opdracht.bedrijf}. Kunnen we hierover praten?`
  );

  const isFilled = opdracht.status === "INGEVULD";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Simple header */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link href={`/g/${slug}`}>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Terug
            </button>
          </Link>
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold">
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

        {/* Reacties counter (no list, just count) */}
        {opdracht._count?.reacties > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {opdracht._count.reacties} {opdracht._count.reacties === 1 ? "persoon heeft" : "personen hebben"} gereageerd
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
