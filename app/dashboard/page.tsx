import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const groups = await prisma.groupMember.findMany({
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
    orderBy: { joinedAt: "desc" },
    take: 5
  });

  const recentJobs = await prisma.job.findMany({
    where: {
      OR: [
        { createdById: session.user.id },
        {
          shares: {
            some: {
              group: {
                members: {
                  some: { userId: session.user.id }
                }
              }
            }
          }
        }
      ],
      status: "OPEN"
    },
    include: {
      shares: {
        include: {
          group: {
            select: { name: true }
          }
        }
      },
      createdBy: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" href="/dashboard" />
          <Link href="/api/auth/signout">
            <button className="text-sm text-secondary hover:text-white transition-colors">
              Uitloggen
            </button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-secondary text-sm">
            {session.user.name || session.user.email}
          </p>
        </div>

        <div className="mb-8">
          <Link href="/dashboard/jobs/new">
            <button className="btn btn-primary w-full py-4 text-lg">
              + Nieuwe opdracht
            </button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Mijn groepen</h2>
            <Link href="/dashboard/groups/new">
              <button className="text-sm text-accent hover:opacity-80">
                + Nieuwe groep
              </button>
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-secondary mb-4">
                Je bent nog geen lid van een groep
              </p>
              <Link href="/dashboard/groups/new">
                <button className="btn btn-secondary">
                  Maak je eerste groep
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(({ group, role }) => (
                <Link key={group.id} href={`/dashboard/groups/${group.slug}`}>
                  <div className="card hover:opacity-90 transition-opacity cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">
                          {group.name || "Naamloze groep"}
                        </h3>
                        <p className="text-xs text-tertiary mt-1">
                          {group._count.jobShares}{" "}
                          {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
                          {role === "ADMIN" && " · Admin"}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-tertiary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recente opdrachten
          </h2>

          {recentJobs.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-secondary mb-4">Nog geen opdrachten</p>
              <Link href="/dashboard/jobs/new">
                <button className="btn btn-primary">
                  Plaats je eerste opdracht
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => {
                const isOwner = job.createdById === session.user?.id;
                return (
                  <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                    <div className="job-card cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold flex-1">
                          {job.title}
                        </h3>
                        {isOwner && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            Jouw opdracht
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary mb-2">{job.company}</p>
                      <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
                        <span className="text-accent font-semibold">
                          €{job.rate}/uur
                        </span>
                        <span>•</span>
                        <span>{job.locationType}</span>
                        {job.hoursPerWeek && (
                          <>
                            <span>•</span>
                            <span>{job.hoursPerWeek}u/w</span>
                          </>
                        )}
                      </div>
                      {job.shares.length > 0 && (
                        <p className="text-xs text-tertiary">
                          Gedeeld in: {job.shares.map((s) => s.group.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
