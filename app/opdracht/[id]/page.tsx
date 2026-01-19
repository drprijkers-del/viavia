import { getOpdracht } from "@/app/actions/queries";
import { formatTariff, parseTags, createWhatsAppLink } from "@/lib/utils";
import Link from "next/link";
import ShareButton from "@/app/components/ShareButton";
import ReactieForm from "@/app/components/ReactieForm";
import ReactieList from "@/app/components/ReactieList";
import MarkAsFilledButton from "@/app/components/MarkAsFilledButton";

export default async function OpdrachDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opdracht = await getOpdracht(id);

  if (!opdracht) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">
            Opdracht niet gevonden
          </h2>
          <Link href="/">
            <button className="btn btn-primary">← Terug naar overzicht</button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = parseTags(opdracht.tags);
  const whatsappLink = createWhatsAppLink(
    opdracht.plaatser_whatsapp,
    `Hoi ${opdracht.plaatser_naam}, ik ben geïnteresseerd in je opdracht: "${opdracht.titel}". Kan jij mij meer vertellen?`
  );

  const isFilled = opdracht.status === "INGEVULD";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container-main">
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <button className="btn btn-outline">← Terug</button>
            </Link>
            <div className="flex items-center gap-3">
              <ShareButton opdrachtId={opdracht.id} titel={opdracht.titel} />
              <span className={`badge ${isFilled ? "badge-filled" : "badge-open"}`}>
                {isFilled ? "✓ Ingevuld" : "🟢 Open"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className={`glass rounded-2xl p-8 mb-6 ${isFilled ? "opacity-75" : ""}`}>
            <h1 className={`text-4xl font-bold mb-4 ${isFilled ? "line-through text-gray-500" : "text-white"}`}>
              {opdracht.titel}
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {opdracht.omschrijving}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium ring-1 ring-emerald-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Locatie */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                📍 Locatie
              </h3>
              <p className="text-white text-lg">
                {opdracht.locatie === "Remote" && "🌐 Remote"}
                {opdracht.locatie === "OnSite" && `📍 ${opdracht.plaats || "On-site"}`}
                {opdracht.locatie === "Hybride" &&
                  `🏢 Hybride (${opdracht.hybride_dagen_per_week} dagen/week${opdracht.plaats ? `, ${opdracht.plaats}` : ""})`}
              </p>
            </div>

            {/* Tarief */}
            {(opdracht.uurtarief_min || opdracht.uurtarief_max) && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  💰 Uurtarief
                </h3>
                <p className="text-emerald-400 text-lg font-semibold">
                  {formatTariff(
                    opdracht.uurtarief_min,
                    opdracht.uurtarief_max,
                    opdracht.valuta || "EUR"
                  )}
                </p>
              </div>
            )}

            {/* Startdatum */}
            {opdracht.startdatum && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  📅 Startdatum
                </h3>
                <p className="text-white text-lg">{opdracht.startdatum}</p>
              </div>
            )}

            {/* Duur */}
            {opdracht.duur && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  ⏱️ Duur
                </h3>
                <p className="text-white text-lg">{opdracht.duur}</p>
              </div>
            )}

            {/* Inzet */}
            {opdracht.inzet && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  ⚡ Inzet
                </h3>
                <p className="text-white text-lg">{opdracht.inzet}</p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Plaatser
                </h3>
                <p className="text-white text-xl font-medium mb-4">{opdracht.plaatser_naam}</p>

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary w-full text-base">
                    💬 Contacteer via WhatsApp
                  </button>
                </a>

                {/* Mark as filled */}
                <MarkAsFilledButton opdrachtId={opdracht.id} />
              </div>
            </div>
          </div>

          {/* Reacties Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span>💬</span>
              <span>Reacties</span>
              <span className="text-sm font-normal text-gray-400">
                ({opdracht._count?.reacties || 0})
              </span>
            </h2>

            {/* Reactie Form */}
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4 text-gray-200">Toon je interesse</h3>
              <ReactieForm opdrachtId={opdracht.id} />
            </div>

            {/* Reactie List */}
            {opdracht.reacties && opdracht.reacties.length > 0 ? (
              <ReactieList reacties={opdracht.reacties} />
            ) : (
              <div className="text-center py-12 glass rounded-xl">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-gray-400">Nog geen reacties. Jij kunt de eerste zijn!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
