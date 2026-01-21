import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Check if auth is configured
  if (!process.env.NEXTAUTH_SECRET) {
    redirect("/");
  }

  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/");
  }

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get all groups user is member of
  const groups = await prisma.groupMember.findMany({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          _count: {
            select: { jobShares: true, members: true }
          }
        }
      }
    },
    orderBy: { joinedAt: "desc" }
  });

  // Get all jobs from user's groups
  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      shares: {
        some: {
          group: {
            members: {
              some: { userId: session.user.id }
            }
          }
        }
      }
    },
    include: {
      shares: {
        select: {
          groupId: true,
          group: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardClient
      groups={groups}
      jobs={jobs}
      userEmail={session.user.email || ""}
      userId={session.user.id}
    />
  );
}
