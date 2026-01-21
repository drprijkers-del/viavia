import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default async function JoinGroupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Find the group by invite token
  const group = await prisma.groupV2.findUnique({
    where: { inviteToken: token },
    include: {
      _count: {
        select: {
          members: true,
          jobShares: true
        }
      },
      jobShares: {
        take: 5,
        orderBy: { sharedAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              rate: true,
              locationType: true,
              status: true
            }
          }
        }
      }
    }
  });

  if (!group) notFound();

  // Check if user is logged in
  const session = await auth();

  // If logged in, automatically add as member and redirect to dashboard
  if (session?.user?.id) {
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: session.user.id
        }
      }
    });

    if (!existingMember) {
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

  // Not logged in - show public welcome page
  const recentJobs = group.jobShares
    .map(share => share.job)
    .filter(job => job.status === "OPEN");

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" href="/" />
          <Link href={`/login?callbackUrl=/join/${token}`}>
            <button className="text-sm text-accent hover:opacity-80 transition-opacity">
              Inloggen
            </button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {group.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {group.name || "ViaVia Groep"}
          </h1>
          <p className="text-secondary">
            {group._count.members} {group._count.members === 1 ? "lid" : "leden"} · {group._count.jobShares} {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
          </p>
        </div>

        <div className="card mb-6 text-center">
          <h2 className="text-lg font-semibold text-white mb-2">
            Je bent uitgenodigd!
          </h2>
          <p className="text-secondary text-sm mb-4">
            Log in om lid te worden en alle opdrachten te zien
          </p>
          <Link href={`/login?callbackUrl=/join/${token}`}>
            <button className="btn btn-primary w-full">
              Log in om deel te nemen
            </button>
          </Link>
        </div>

        {recentJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Recente opdrachten
            </h2>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="job-card cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold flex-1">
                        {job.title}
                      </h3>
                    </div>
                    <p className="text-sm text-secondary mb-2">{job.company}</p>
                    <div className="flex items-center gap-2 text-xs text-tertiary">
                      <span className="text-accent font-semibold">
                        €{job.rate}/uur
                      </span>
                      <span>•</span>
                      <span>{job.locationType}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-tertiary">
            ViaVia - Freelance opdrachten delen zonder WhatsApp-scrollen
          </p>
        </div>
      </div>
    </div>
  );
}
