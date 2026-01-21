import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GroupManageClient from "./GroupManageClient";

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
      group: { slug }
    },
    include: {
      group: {
        include: {
          members: {
            include: { user: true }
          },
          jobShares: {
            include: {
              job: true
            },
            orderBy: { sharedAt: "desc" }
          }
        }
      }
    }
  });

  if (!membership) notFound();

  const { group, role } = membership;
  const inviteUrl = `${process.env.NEXTAUTH_URL || "https://viavia76.vercel.app"}/invite/${group.inviteToken}`;

  return (
    <GroupManageClient
      group={{
        id: group.id,
        name: group.name,
        slug: group.slug,
        inviteUrl,
      }}
      members={group.members.map(m => ({
        id: m.id,
        role: m.role,
        userId: m.userId,
        user: {
          name: m.user.name,
          email: m.user.email,
        }
      }))}
      jobs={group.jobShares.map(js => ({
        id: js.job.id,
        title: js.job.title,
        company: js.job.company,
        rate: js.job.rate,
        locationType: js.job.locationType,
        hoursPerWeek: js.job.hoursPerWeek,
        createdById: js.job.createdById,
        shareId: js.id,
      }))}
      isAdmin={role === "ADMIN"}
      currentUserId={session.user.id}
    />
  );
}
