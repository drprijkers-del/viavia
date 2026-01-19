"use client";

import { useState, useEffect } from "react";
import { listKandidaten } from "@/app/actions/kandidaat";

interface Kandidaat {
  id: string;
  naam: string;
  hoofdskill: string;
  skills: string[];
  whatsapp_nummer: string;
  beschikbaar: boolean;
}

interface KandidatenSidebarProps {
  currentJob?: {
    titel: string;
    omschrijving: string;
    tags?: string;
  };
}

export default function KandidatenSidebar({ currentJob }: KandidatenSidebarProps) {
  const [kandidaten, setKandidaten] = useState<Kandidaat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKandidaten();
  }, []);

  const loadKandidaten = async () => {
    setLoading(true);
    const data = await listKandidaten(true); // Only beschikbaar
    setKandidaten(data);
    setLoading(false);
  };

  const checkMatch = (kandidaat: Kandidaat): boolean => {
    if (!currentJob) return false;

    const jobText = `${currentJob.titel} ${currentJob.omschrijving} ${currentJob.tags || ""}`.toLowerCase();

    // Check if any of the kandidaat's skills appear in the job
    return kandidaat.skills.some(skill =>
      jobText.includes(skill.toLowerCase())
    ) || jobText.includes(kandidaat.hoofdskill.toLowerCase());
  };

  const recommendKandidaat = (kandidaat: Kandidaat) => {
    if (!currentJob) return;

    const url = window.location.href;
    const text = `Hey ${kandidaat.naam}! Ik dacht dat deze opdracht perfect voor je is:\n\n${currentJob.titel}\n\n${url}`;
    const whatsappLink = `https://wa.me/${kandidaat.whatsapp_nummer.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, "_blank");
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (kandidaten.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Geen kandidaten beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {kandidaten.map((kandidaat) => {
        const isMatch = checkMatch(kandidaat);

        return (
          <div
            key={kandidaat.id}
            className={`glass rounded-lg p-3 transition-all duration-200 ${
              isMatch
                ? "border-2 border-emerald-500/50 bg-emerald-500/5"
                : "border border-gray-800"
            }`}
          >
            {isMatch && (
              <div className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                <span>✨</span>
                <span>Match!</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">
                  {kandidaat.naam}
                </h4>
                <p className="text-xs text-emerald-400 truncate">
                  {kandidaat.hoofdskill}
                </p>
              </div>

              {isMatch && (
                <button
                  onClick={() => recommendKandidaat(kandidaat)}
                  className="btn bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 text-xs flex-shrink-0"
                  title={`Aanbevelen aan ${kandidaat.naam}`}
                >
                  👤
                </button>
              )}
            </div>

            {kandidaat.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {kandidaat.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {kandidaat.skills.length > 3 && (
                  <span className="text-[10px] text-gray-500">
                    +{kandidaat.skills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
