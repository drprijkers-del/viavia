import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; shareId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: jobId, shareId } = await params;

  // Get the job share
  const share = await prisma.jobShare.findUnique({
    where: { id: shareId },
    include: {
      job: true,
      group: {
        include: {
          members: {
            where: { userId: session.user.id }
          }
        }
      }
    }
  });

  if (!share) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }

  // Check if user can delete: must be job creator or group admin
  const isJobCreator = share.job.createdById === session.user.id;
  const isGroupAdmin = share.group.members.some(m => m.role === "ADMIN");

  if (!isJobCreator && !isGroupAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Delete the share
  await prisma.jobShare.delete({
    where: { id: shareId }
  });

  return NextResponse.json({ success: true });
}
