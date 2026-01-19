"use server";

import { db } from "@/lib/db";
import {
  generateEditToken,
  isValidPhoneNumber,
  normalizePhoneNumber,
  stringifyTags,
} from "@/lib/utils";

export interface CreateOpdracht {
  titel: string;
  omschrijving: string;
  locatie: "Remote" | "OnSite" | "Hybride";
  plaats?: string;
  hybride_dagen_per_week?: number;
  uurtarief_min?: number;
  uurtarief_max?: number;
  valuta?: string;
  startdatum?: string;
  duur?: string;
  inzet?: string;
  tags?: string[];
  plaatser_naam: string;
  plaatser_whatsapp: string;
}

export async function createOpdracht(data: CreateOpdracht) {
  // Validate required fields
  if (!data.titel || !data.omschrijving || !data.plaatser_naam) {
    return { error: "Titel, omschrijving en naam zijn verplicht" };
  }

  if (!isValidPhoneNumber(data.plaatser_whatsapp)) {
    return { error: "Ongeldig WhatsApp-nummer" };
  }

  // Validate locatie-specific fields
  if (data.locatie !== "Remote" && !data.plaats) {
    return { error: "Plaats is verplicht voor On-site/Hybride" };
  }

  if (data.locatie === "Hybride" && !data.hybride_dagen_per_week) {
    return { error: "Aantal dagen is verplicht voor Hybride" };
  }

  try {
    const normalizedPhone = normalizePhoneNumber(data.plaatser_whatsapp);

    const opdracht = await db.opdracht.create({
      data: {
        titel: data.titel.trim(),
        omschrijving: data.omschrijving.trim(),
        locatie: data.locatie,
        plaats: data.plaats?.trim() || null,
        hybride_dagen_per_week: data.hybride_dagen_per_week || null,
        uurtarief_min: data.uurtarief_min || null,
        uurtarief_max: data.uurtarief_max || null,
        valuta: data.valuta || "EUR",
        startdatum: data.startdatum?.trim() || null,
        duur: data.duur?.trim() || null,
        inzet: data.inzet?.trim() || null,
        tags: data.tags ? stringifyTags(data.tags) : null,
        plaatser_naam: data.plaatser_naam.trim(),
        plaatser_whatsapp: normalizedPhone,
        status: "OPEN",
        edit_token: generateEditToken(),
      },
    });

    return { success: true, opdrachtId: opdracht.id };
  } catch (error) {
    console.error("Error creating opdracht:", error);
    return { error: "Er is iets misgegaan bij het aanmaken van de opdracht" };
  }
}

export async function createReactie(
  opdrachtId: string,
  data: {
    naam: string;
    bericht?: string;
    whatsapp_nummer?: string;
  }
) {
  if (!data.naam) {
    return { error: "Naam is verplicht" };
  }

  try {
    const reactie = await db.reactie.create({
      data: {
        opdracht_id: opdrachtId,
        naam: data.naam.trim(),
        bericht: data.bericht?.trim() || null,
        whatsapp_nummer: data.whatsapp_nummer?.trim() || null,
      },
    });

    return { success: true, reactieId: reactie.id };
  } catch (error) {
    console.error("Error creating reactie:", error);
    return { error: "Er is iets misgegaan bij het plaatsen van je reactie" };
  }
}

export async function updateOpdracht(
  opdrachtId: string,
  editToken: string,
  data: {
    status?: "OPEN" | "INGEVULD";
  }
) {
  try {
    // Verify edit token
    const opdracht = await db.opdracht.findUnique({
      where: { id: opdrachtId },
    });

    if (!opdracht) {
      return { error: "Opdracht niet gevonden" };
    }

    if (opdracht.edit_token !== editToken) {
      return { error: "Je mag deze opdracht niet wijzigen" };
    }

    if (data.status) {
      await db.opdracht.update({
        where: { id: opdrachtId },
        data: { status: data.status },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating opdracht:", error);
    return { error: "Er is iets misgegaan bij het bijwerken van de opdracht" };
  }
}
