"use server";

import { db } from "@/lib/db";

export interface CreateKandidaat {
  naam: string;
  hoofdskill: string;
  skills?: string[]; // Array of skill strings
  whatsapp_nummer: string;
}

export async function createKandidaat(data: CreateKandidaat) {
  try {
    const kandidaat = await db.kandidaat.create({
      data: {
        naam: data.naam,
        hoofdskill: data.hoofdskill,
        skills: data.skills ? JSON.stringify(data.skills) : null,
        whatsapp_nummer: data.whatsapp_nummer,
        beschikbaar: true,
      },
    });

    return { success: true, kandidaatId: kandidaat.id };
  } catch (error) {
    console.error("Error creating kandidaat:", error);
    return { success: false, error: "Fout bij aanmaken kandidaat" };
  }
}

export async function listKandidaten(beschikbaar?: boolean) {
  try {
    const kandidaten = await db.kandidaat.findMany({
      where: beschikbaar !== undefined ? { beschikbaar } : {},
      orderBy: { created_at: "desc" },
    });

    // Parse skills JSON
    return kandidaten.map((k) => ({
      ...k,
      skills: k.skills ? JSON.parse(k.skills) : [],
    }));
  } catch (error) {
    console.error("Error listing kandidaten:", error);
    return [];
  }
}

export async function toggleKandidaatBeschikbaarheid(id: string) {
  try {
    const kandidaat = await db.kandidaat.findUnique({ where: { id } });
    if (!kandidaat) {
      return { success: false, error: "Kandidaat niet gevonden" };
    }

    await db.kandidaat.update({
      where: { id },
      data: { beschikbaar: !kandidaat.beschikbaar },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling kandidaat:", error);
    return { success: false, error: "Fout bij updaten kandidaat" };
  }
}
