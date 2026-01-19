"use server";

import { db } from "@/lib/db";

export async function deleteOpdracht(id: string, editToken: string) {
  try {
    // Verify edit token
    const opdracht = await db.opdracht.findUnique({
      where: { id },
      select: { edit_token: true },
    });

    if (!opdracht || opdracht.edit_token !== editToken) {
      return { success: false, error: "Niet geautoriseerd" };
    }

    await db.opdracht.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting opdracht:", error);
    return { success: false, error: "Fout bij verwijderen" };
  }
}

export async function markOpdrachtAsIngevuld(id: string, editToken: string) {
  try {
    const opdracht = await db.opdracht.findUnique({
      where: { id },
      select: { edit_token: true },
    });

    if (!opdracht || opdracht.edit_token !== editToken) {
      return { success: false, error: "Niet geautoriseerd" };
    }

    await db.opdracht.update({
      where: { id },
      data: { status: "INGEVULD" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking opdracht:", error);
    return { success: false, error: "Fout bij updaten" };
  }
}
