import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50) + "-" + Math.random().toString(36).substring(2, 6);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const slug = generateSlug(name);

  const group = await prisma.groupV2.create({
    data: {
      name: name.trim(),
      slug,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN"
        }
      }
    }
  });

  return NextResponse.json({ group });
}
