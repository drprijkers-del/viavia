import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          _count: {
            select: { jobShares: true }
          }
        }
      }
    },
    orderBy: { joinedAt: "desc" }
  });

  const groups = memberships.map(m => ({
    id: m.group.id,
    name: m.group.name,
    slug: m.group.slug,
    role: m.role,
    _count: m.group._count
  }));

  return NextResponse.json({ groups });
}
