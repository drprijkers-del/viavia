import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupIds } = await req.json();

  if (!Array.isArray(groupIds) || groupIds.length === 0) {
    return NextResponse.json({ error: "Invalid groupIds" }, { status: 400 });
  }

  // Verify job ownership
  const job = await prisma.job.findUnique({
    where: { id }
  });

  if (!job || job.createdById !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify user is member of all selected groups
  const memberships = await prisma.groupMember.findMany({
    where: {
      userId: session.user.id,
      groupId: { in: groupIds }
    }
  });

  if (memberships.length !== groupIds.length) {
    return NextResponse.json({ error: "Not member of all groups" }, { status: 403 });
  }

  // Create shares (upsert to handle duplicates)
  const userId = session.user.id!;
  await Promise.all(
    groupIds.map(groupId =>
      prisma.jobShare.upsert({
        where: {
          jobId_groupId: {
            jobId: id,
            groupId
          }
        },
        create: {
          jobId: id,
          groupId,
          sharedById: userId
        },
        update: {}
      })
    )
  );

  return NextResponse.json({ success: true });
}
