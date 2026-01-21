import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: groupId } = await params;

  // Check if user is admin of this group
  const membership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
      groupId,
      role: "ADMIN"
    }
  });

  if (!membership) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Delete all job shares in this group first
  await prisma.jobShare.deleteMany({
    where: { groupId }
  });

  // Delete all members
  await prisma.groupMember.deleteMany({
    where: { groupId }
  });

  // Delete the group
  await prisma.group.delete({
    where: { id: groupId }
  });

  return NextResponse.json({ success: true });
}
