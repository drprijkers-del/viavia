import { getOpdracht } from "@/app/actions/queries";
import { formatTariff, createWhatsAppLink } from "@/lib/utils";
import Link from "next/link";
import ShareButton from "@/app/components/ShareButton";
import ReactieForm from "@/app/components/ReactieForm";
import ReactieList from "@/app/components/ReactieList";
import MarkAsFilledButton from "@/app/components/MarkAsFilledButton";
import RecommendButton from "@/app/components/RecommendButton";
import DeleteButton from "@/app/components/DeleteButton";

export default async function OpdrachDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opdracht = await getOpdracht(id);

  if (!opdracht) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 flex items-center justify-center">
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

  const whatsappLink = createWhatsAppLink(
    opdracht.plaatser_whatsapp,
    `Hoi ${opdracht.plaatser_naam}, ik ben geïnteresseerd in je opdracht: "${opdracht.titel}". Kan jij mij meer vertellen?`
  );

  const isFilled = opdracht.status === "INGEVULD";

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950">
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

      <div className="container-main py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-0">
          {/* Contact Section - Moved to top */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-emerald-500/20">
                {opdracht.plaatser_naam?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Geplaatst door</p>
                <p className="text-white text-2xl font-semibold">{opdracht.plaatser_naam}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <button className="btn w-full py-4 text-base bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg">
                  💬 Chat via WhatsApp
                </button>
              </a>

              <RecommendButton opdrachtId={opdracht.id} titel={opdracht.titel} />

              {/* Mark as filled */}
              <MarkAsFilledButton opdrachtId={opdracht.id} />

              {/* Delete opdracht */}
              <DeleteButton opdrachtId={opdracht.id} />
            </div>
          </div>

          {/* Title Section */}
          <div className={`glass rounded-2xl p-8 sm:p-10 mb-6 sm:mb-8 ${isFilled ? "opacity-75" : ""}`}>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 ${isFilled ? "line-through text-gray-500" : "text-white"}`}>
              {opdracht.titel}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {opdracht.omschrijving}
            </p>
          </div>

          {/* Tags */}
          {opdracht.tags && JSON.parse(opdracht.tags).length > 0 && (
            <div className="glass rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
              <p className="text-gray-400 text-sm mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(opdracht.tags).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-full text-sm font-medium ring-1 ring-emerald-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {/* Locatie */}
            <div className="glass rounded-xl p-5 sm:p-6">
              <p className="text-gray-400 text-sm mb-1">Locatie</p>
              <p className="text-white text-lg sm:text-xl font-medium">
                {opdracht.locatie === "Remote" && "Remote"}
                {opdracht.locatie === "OnSite" && "Op locatie"}
                {opdracht.locatie === "Hybride" && "Hybride"}
                {opdracht.plaats && ` - ${opdracht.plaats}`}
              </p>
              {opdracht.hybride_dagen_per_week && (
                <p className="text-gray-400 text-sm mt-2">
                  {opdracht.hybride_dagen_per_week} {opdracht.hybride_dagen_per_week === 1 ? "dag" : "dagen"} per week op locatie
                </p>
              )}
            </div>

            {/* Tarief */}
            {(opdracht.uurtarief_min || opdracht.uurtarief_max) && (
              <div className="glass rounded-xl p-5 sm:p-6">
                <p className="text-gray-400 text-sm mb-1">Uurtarief</p>
                <p className="text-emerald-400 text-lg sm:text-xl font-semibold">
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
              <div className="glass rounded-xl p-5 sm:p-6">
                <p className="text-gray-400 text-sm mb-1">Startdatum</p>
                <p className="text-white text-lg sm:text-xl font-medium">{opdracht.startdatum}</p>
              </div>
            )}

            {/* Duur */}
            {opdracht.duur && (
              <div className="glass rounded-xl p-5 sm:p-6">
                <p className="text-gray-400 text-sm mb-1">Duur</p>
                <p className="text-white text-lg sm:text-xl font-medium">{opdracht.duur}</p>
              </div>
            )}

            {/* Inzet */}
            {opdracht.inzet && (
              <div className="glass rounded-xl p-5 sm:p-6">
                <p className="text-gray-400 text-sm mb-1">Uren per week</p>
                <p className="text-white text-lg sm:text-xl font-medium">{opdracht.inzet}</p>
              </div>
            )}
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
