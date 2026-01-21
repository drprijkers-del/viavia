import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await auth();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { name: true, email: true }
      },
      shares: {
        include: {
          group: {
            select: { id: true, name: true, slug: true }
          }
        }
      }
    }
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check access: creator or member of shared groups
  const hasAccess =
    session?.user?.id === job.createdById ||
    (session?.user?.id && await prisma.groupMember.findFirst({
      where: {
        userId: session.user.id,
        groupId: { in: job.shares.map(s => s.groupId) }
      }
    }));

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ job });
}
