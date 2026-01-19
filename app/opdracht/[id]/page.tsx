import { getOpdracht } from "@/app/actions/queries";
import { formatTariff, formatCurrency, parseTags, createWhatsAppLink } from "@/lib/utils";
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
      <div className="container-main">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">
            Opdracht niet gevonden
          </h2>
          <Link href="/">
            <button className="btn btn-primary mt-4">← Terug naar board</button>
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

  return (
    <div className="container-main">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <button className="btn btn-outline">← Terug</button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{opdracht.titel}</h1>
            <span
              className={`badge text-base py-1 px-3 ${
                opdracht.status === "OPEN" ? "badge-open" : "badge-filled"
              }`}
            >
              {opdracht.status === "OPEN" ? "✅ Open" : "✅ Ingevuld"}
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {opdracht.omschrijving}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details grid */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Locatie */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
              Locatie
            </h3>
            <p className="text-base">
              {opdracht.locatie === "Remote" && "🌐 Remote"}
              {opdracht.locatie === "OnSite" && `📍 On-site${opdracht.plaats ? ` - ${opdracht.plaats}` : ""}`}
              {opdracht.locatie === "Hybride" &&
                `🏢 Hybride (${opdracht.hybride_dagen_per_week} dagen/week)${opdracht.plaats ? ` - ${opdracht.plaats}` : ""}`}
            </p>
          </div>

          {/* Tarief */}
          {(opdracht.uurtarief_min || opdracht.uurtarief_max) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                Uurtarief
              </h3>
              <p className="text-base font-semibold">
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
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                Startdatum
              </h3>
              <p className="text-base">{opdracht.startdatum}</p>
            </div>
          )}

          {/* Duur */}
          {opdracht.duur && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                Duur
              </h3>
              <p className="text-base">{opdracht.duur}</p>
            </div>
          )}

          {/* Inzet */}
          {opdracht.inzet && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">
                Inzet
              </h3>
              <p className="text-base">{opdracht.inzet}</p>
            </div>
          )}
        </div>
      </div>

      {/* Plaatser info */}
      <div className="card bg-gray-50 mb-6">
        <h3 className="font-semibold text-gray-600 uppercase text-sm mb-3">
          Plaatser
        </h3>
        <p className="text-base font-medium mb-3">{opdracht.plaatser_naam}</p>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary w-full">
              💬 Contacteer via WhatsApp
            </button>
          </a>
          <ShareButton
            opdrachtId={opdracht.id}
            titel={opdracht.titel}
          />
        </div>

        {/* Mark as filled - only if we have a token in URL */}
        <MarkAsFilledButton opdrachtId={opdracht.id} />
      </div>

      {/* Reacties Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          💬 Reacties ({opdracht._count?.reacties || 0})
        </h2>

        {/* Reactie Form */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Jouw interesse tonen</h3>
          <ReactieForm opdrachtId={opdracht.id} />
        </div>

        {/* Reactie List */}
        {opdracht.reacties && opdracht.reacties.length > 0 ? (
          <ReactieList reacties={opdracht.reacties} />
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nog geen reacties. Jij kunt de eerste zijn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
