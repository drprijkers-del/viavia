"use server";

import { db } from "@/lib/db";

export interface ListOpdrachtQuery {
  status?: "OPEN" | "INGEVULD" | "ALL";
  locatie?: "Remote" | "OnSite" | "Hybride";
  search?: string;
  sort?: "recent" | "oldest";
}

export async function listOpdrachten(query?: ListOpdrachtQuery) {
  const where: any = {};

  if (query?.status && query.status !== "ALL") {
    where.status = query.status;
  }

  if (query?.locatie) {
    where.locatie = query.locatie;
  }

  if (query?.search) {
    where.OR = [
      { titel: { contains: query.search, mode: "insensitive" } },
      { tags: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const orderBy = query?.sort === "oldest" 
    ? { created_at: "asc" as const } 
    : { created_at: "desc" as const };

  const opdrachten = await db.opdracht.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { reacties: true },
      },
    },
  });

  return opdrachten;
}

export async function getOpdracht(id: string) {
  const opdracht = await db.opdracht.findUnique({
    where: { id },
    include: {
      reacties: {
        orderBy: { created_at: "desc" },
      },
      _count: {
        select: { reacties: true },
      },
    },
  });

  return opdracht;
}

export async function getReacties(opdrachtId: string) {
  const reacties = await db.reactie.findMany({
    where: { opdracht_id: opdrachtId },
    orderBy: { created_at: "desc" },
  });

  return reacties;
}
