import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

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
      }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <ViaViaLogo size="sm" href="/dashboard" />
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm hidden sm:block">
            {session.user.email}
          </span>
          <Link href="/api/auth/signout">
            <button className="text-sm text-muted hover:text-white transition-colors">
              Uitloggen
            </button>
          </Link>
        </div>
      </div>

      {/* Primary CTA */}
      <Link href="/dashboard/jobs/new" className="block mb-8">
        <button className="btn btn-primary w-full text-lg py-4">
          + Nieuwe opdracht
        </button>
      </Link>

      {/* Groups Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mijn groepen</h2>
          <Link href="/dashboard/groups/new">
            <button className="text-sm text-accent hover:opacity-80 transition-opacity">
              + Nieuw
            </button>
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted mb-4">Je bent nog geen lid van een groep</p>
            <Link href="/dashboard/groups/new">
              <button className="btn btn-secondary text-sm">
                Maak je eerste groep
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map(({ group, role }) => (
              <Link key={group.id} href={`/dashboard/groups/${group.slug}`}>
                <div className="card card-interactive card-hover h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-green-600 flex items-center justify-center text-white font-bold shrink-0">
                      {group.name?.charAt(0).toUpperCase() || "V"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {group.name || "Naamloze groep"}
                      </h3>
                      <p className="text-xs text-tertiary mt-0.5">
                        {group._count.members} {group._count.members === 1 ? "lid" : "leden"} · {group._count.jobShares} {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
                        {role === "ADMIN" && <span className="text-accent"> · Admin</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Jobs Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recente opdrachten</h2>

        {recentJobs.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted mb-4">Nog geen opdrachten</p>
            <Link href="/dashboard/jobs/new">
              <button className="btn btn-primary text-sm">
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
                  <div className="job-card">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{job.title}</h3>
                        <p className="text-sm text-muted">{job.company}</p>
                      </div>
                      {isOwner && (
                        <span className="badge badge-open shrink-0">
                          Jouw
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-accent font-semibold">€{job.rate}/uur</span>
                      <span className="text-tertiary">{job.locationType}</span>
                      {job.hoursPerWeek && (
                        <span className="text-tertiary">{job.hoursPerWeek}u/w</span>
                      )}
                      {job.shares.length > 0 && (
                        <span className="text-tertiary truncate max-w-[150px]">
                          in {job.shares.map((s) => s.group.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
