"use server";

import { db } from "@/lib/db";
import {
  generateEditToken,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from "@/lib/utils";

export interface CreateOpdracht {
  groupId: string; // required for group association (can be single or first in array)
  groupIds?: string[]; // optional: post to multiple groups
  titel: string;
  bedrijf: string;
  omschrijving: string;
  uurtarief: number;
  locatie: "Remote" | "OnSite" | "Hybride";
  locatie_detail?: string;
  uren_per_week?: number;
  duur_maanden?: number;
  teamgrootte?: string;
  plaatser_naam: string;
  plaatser_whatsapp: string;
}

export async function createOpdracht(data: CreateOpdracht) {
  // Validate required fields
  if (!data.groupId) {
    return { error: "Groep ID is verplicht" };
  }

  if (!data.titel || !data.bedrijf || !data.omschrijving || !data.plaatser_naam) {
    return { error: "Functie, bedrijf, omschrijving en naam zijn verplicht" };
  }

  if (!data.uurtarief || data.uurtarief <= 0) {
    return { error: "Uurtarief is verplicht" };
  }

  if (!isValidPhoneNumber(data.plaatser_whatsapp)) {
    return { error: "Ongeldig WhatsApp-nummer" };
  }

  try {
    const normalizedPhone = normalizePhoneNumber(data.plaatser_whatsapp);

    // Determine which groups to post to
    const targetGroups = data.groupIds && data.groupIds.length > 0
      ? data.groupIds
      : [data.groupId];

    // Create opdracht for each selected group
    const createdOpdrachten = await Promise.all(
      targetGroups.map(groupId =>
        db.opdracht.create({
          data: {
            group_id: groupId,
            titel: data.titel.trim(),
            bedrijf: data.bedrijf.trim(),
            omschrijving: data.omschrijving.trim(),
            uurtarief: data.uurtarief,
            locatie: data.locatie,
            locatie_detail: data.locatie_detail?.trim() || null,
            uren_per_week: data.uren_per_week || null,
            duur_maanden: data.duur_maanden || null,
            teamgrootte: data.teamgrootte?.trim() || null,
            plaatser_naam: data.plaatser_naam.trim(),
            plaatser_whatsapp: normalizedPhone,
            status: "OPEN",
            edit_token: generateEditToken(),
          },
        })
      )
    );

    return {
      success: true,
      opdrachtId: createdOpdrachten[0].id,
      count: createdOpdrachten.length
    };
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

export async function deleteOpdracht(opdrachtId: string, editToken: string) {
  try {
    // Verify edit token
    const opdracht = await db.opdracht.findUnique({
      where: { id: opdrachtId },
    });

    if (!opdracht) {
      return { error: "Opdracht niet gevonden" };
    }

    if (opdracht.edit_token !== editToken) {
      return { error: "Je mag deze opdracht niet verwijderen" };
    }

    await db.opdracht.delete({
      where: { id: opdrachtId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting opdracht:", error);
    return { error: "Er is iets misgegaan bij het verwijderen van de opdracht" };
  }
}
