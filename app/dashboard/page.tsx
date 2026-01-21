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

  // Get groups where user is ADMIN
  const adminGroups = await prisma.groupMember.findMany({
    where: {
      userId: session.user.id,
      role: "ADMIN"
    },
    include: {
      group: true
    }
  });

  // If user has no admin groups, redirect to create first group
  if (adminGroups.length === 0) {
    redirect("/dashboard/groups/new");
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
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <div className="app-frame-wide">
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
      <Link href="/dashboard/groups/new" className="block mb-8">
        <button className="btn btn-primary w-full text-lg py-4">
          + Nieuwe groep
        </button>
      </Link>

      {/* Groups Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Mijn groepen</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map(({ group, role }) => (
            <Link key={group.id} href={`/g/${group.slug}`}>
              <div className="card card-interactive card-hover h-full">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent to-green-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {group.name?.charAt(0).toUpperCase() || "V"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate text-base">
                      {group.name || "Naamloze groep"}
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                      {group._count.members} {group._count.members === 1 ? "lid" : "leden"} · {group._count.jobShares} {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
                    </p>
                    {role === "ADMIN" && (
                      <span className="inline-block mt-1 text-xs text-accent font-medium">Admin</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Recente opdrachten</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {recentJobs.map((job) => {
              const isOwner = job.createdById === session.user?.id;
              const firstShare = job.shares[0];
              return (
                <Link key={job.id} href={firstShare ? `/g/${firstShare.group.slug}/j/${job.id}` : `/dashboard/jobs/${job.id}`}>
                  <div className="job-card h-full">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{job.title}</h3>
                        <p className="text-sm text-muted">{job.company}</p>
                      </div>
                      {isOwner && (
                        <span className="badge badge-open shrink-0 text-xs">
                          Jouw
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="text-accent font-semibold">€{job.rate}/uur</span>
                      <span className="text-tertiary">{job.locationType}</span>
                      {job.hoursPerWeek && (
                        <span className="text-tertiary">{job.hoursPerWeek}u/w</span>
                      )}
                    </div>
                    {job.shares.length > 0 && (
                      <p className="text-xs text-tertiary mt-2 truncate">
                        in {job.shares.map((s) => s.group.name).join(", ")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
