"use server";

import { db } from "@/lib/db";

export interface ListOpdrachtQuery {
  groupId?: string; // filter by group
  status?: "OPEN" | "INGEVULD" | "ALL";
  locatie?: "Remote" | "OnSite" | "Hybride";
  search?: string;
  sort?: "recent" | "oldest";
}

export async function listOpdrachten(query?: ListOpdrachtQuery) {
  try {
    const where: any = {};

    if (query?.groupId) {
      where.group_id = query.groupId;
    }

    if (query?.status && query.status !== "ALL") {
      where.status = query.status;
    }

    if (query?.locatie) {
      where.locatie = query.locatie;
    }

    if (query?.search) {
      // PostgreSQL supports case-insensitive search with mode option
      where.OR = [
        { titel: { contains: query.search, mode: "insensitive" } },
        { bedrijf: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const orderBy = query?.sort === "oldest"
      ? { created_at: "asc" as const }
      : { created_at: "desc" as const };

    const opdrachten = await db.opdracht.findMany({
      where,
      orderBy,
      include: {
        group: {
          select: {
            slug: true,
            name: true,
          },
        },
        _count: {
          select: { reacties: true },
        },
      },
    });

    return opdrachten;
  } catch (error) {
    console.error("Error loading opdrachten:", error);
    return [];
  }
}

export async function getOpdracht(id: string) {
  try {
    const opdracht = await db.opdracht.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            slug: true,
            name: true,
          },
        },
        reacties: {
          orderBy: { created_at: "desc" as const },
        },
        _count: {
          select: { reacties: true },
        },
      },
    });
    return opdracht;
  } catch (error) {
    console.error("Error loading opdracht:", error);
    return null;
  }
}

export async function getReacties(opdrachtId: string) {
  const reacties = await db.reactie.findMany({
    where: { opdracht_id: opdrachtId },
    orderBy: { created_at: "desc" },
  });

  return reacties;
}
