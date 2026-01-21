import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function JoinGroupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/join/${token}`);
  }

  const group = await prisma.groupV2.findUnique({
    where: { inviteToken: token },
    include: {
      members: {
        where: { userId: session.user.id }
      }
    }
  });

  if (!group) notFound();

  const alreadyMember = group.members.length > 0;

  if (!alreadyMember) {
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: session.user.id,
        role: "MEMBER"
      }
    });
  }

  redirect(`/dashboard/groups/${group.slug}`);
}
