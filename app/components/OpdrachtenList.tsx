import Link from "next/link";
import { formatTariff, parseTags } from "@/lib/utils";

interface Opdracht {
  id: string;
  titel: string;
  locatie: string;
  plaats?: string;
  hybride_dagen_per_week?: number;
  uurtarief_min?: number;
  uurtarief_max?: number;
  valuta?: string;
  status: string;
  tags?: string;
  _count?: { reacties: number };
}

export default function OpdrachtenList({
  opdrachten,
}: {
  opdrachten: Opdracht[];
}) {
  if (opdrachten.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Geen opdrachten gevonden</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {opdrachten.map((opdracht) => (
        <Link key={opdracht.id} href={`/opdracht/${opdracht.id}`}>
          <div className="card cursor-pointer">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base truncate">
                    {opdracht.titel}
                  </h3>
                  <span
                    className={`badge flex-shrink-0 ${
                      opdracht.status === "OPEN"
                        ? "badge-open"
                        : "badge-filled"
                    }`}
                  >
                    {opdracht.status === "OPEN" ? "Open" : "Ingevuld"}
                  </span>
                </div>

                {/* Location badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-gray-600">
                  {opdracht.locatie === "Remote" && <span>🌐 Remote</span>}
                  {opdracht.locatie === "OnSite" && <span>📍 On-site</span>}
                  {opdracht.locatie === "Hybride" && (
                    <span>
                      🏢 Hybride ({opdracht.hybride_dagen_per_week}d/week)
                    </span>
                  )}
                  {opdracht.plaats && <span>• {opdracht.plaats}</span>}
                </div>

                {/* Tariff & Tags */}
                <div className="flex items-center gap-3 flex-wrap text-sm text-gray-700">
                  {(opdracht.uurtarief_min || opdracht.uurtarief_max) && (
                    <span className="font-medium">
                      {formatTariff(
                        opdracht.uurtarief_min,
                        opdracht.uurtarief_max,
                        opdracht.valuta || "EUR"
                      )}
                    </span>
                  )}
                  {opdracht.tags && (
                    <span className="text-gray-500">
                      {parseTags(opdracht.tags).slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Reaction count */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium text-green-600">
                  💬 {opdracht._count?.reacties || 0}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
