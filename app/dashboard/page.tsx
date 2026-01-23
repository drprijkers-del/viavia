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
      <div className="app-container-wide pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 mt-6 animate-fade-in">
          <ViaViaLogo size="sm" href="/dashboard" />
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-secondary text-sm">
              {session.user.name || session.user.email}
            </span>
            <Link href="/api/auth/signout">
              <button className="text-sm text-secondary hover:text-white transition-colors">
                Uitloggen
              </button>
            </Link>
          </div>
        </header>

        {/* Desktop layout with sidebar */}
        <div className="dashboard-layout">
          {/* Sidebar - visible on desktop */}
          <aside className="desktop-sidebar">
            <div className="card card-gradient mb-6 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white text-lg font-bold">
                  {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {session.user.name || "Gebruiker"}
                  </p>
                  <p className="text-xs text-tertiary truncate max-w-[180px]">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <div className="divider"></div>
              <nav className="space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#34C759]/10 text-accent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/dashboard/jobs/new" className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:text-white hover:bg-[#3A3A3C] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nieuwe opdracht</span>
                </Link>
                <Link href="/dashboard/groups/new" className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:text-white hover:bg-[#3A3A3C] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Nieuwe groep</span>
                </Link>
              </nav>
            </div>

            {/* Quick stats on desktop */}
            <div className="card card-gradient animate-slide-in-left" style={{ animationDelay: "100ms" }}>
              <h3 className="text-sm text-tertiary uppercase tracking-wide mb-4">Statistieken</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary">Groepen</span>
                  <span className="text-white font-semibold">{groups.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary">Open opdrachten</span>
                  <span className="text-accent font-semibold">{recentJobs.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main>
            {/* Mobile header - hidden on desktop */}
            <div className="lg:hidden text-center mb-8 animate-slide-up">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-secondary text-sm">
                {session.user.name || session.user.email}
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-8 animate-slide-up">
              <Link href="/dashboard/jobs/new">
                <button className="btn btn-primary btn-glow w-full py-4 text-lg">
                  + Nieuwe opdracht
                </button>
              </Link>
            </div>

            {/* Groups section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Mijn groepen</h2>
                <Link href="/dashboard/groups/new">
                  <button className="text-sm text-accent hover:opacity-80 transition-opacity">
                    + Nieuwe groep
                  </button>
                </Link>
              </div>

              {groups.length === 0 ? (
                <div className="card card-gradient text-center py-8 animate-scale-in">
                  <div className="text-4xl mb-4">👥</div>
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
                <div className="desktop-grid-2 stagger-animate">
                  {groups.map(({ group, role }) => (
                    <Link key={group.id} href={`/dashboard/groups/${group.slug}`}>
                      <div className="card card-gradient card-hover-lift cursor-pointer h-full">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white text-lg font-bold shrink-0">
                            {group.name?.charAt(0).toUpperCase() || "G"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">
                              {group.name || "Naamloze groep"}
                            </h3>
                            <p className="text-xs text-tertiary mt-1">
                              {group._count.jobShares}{" "}
                              {group._count.jobShares === 1 ? "opdracht" : "opdrachten"}
                              {role === "ADMIN" && (
                                <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent rounded-full text-[10px]">
                                  Admin
                                </span>
                              )}
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 text-tertiary shrink-0"
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
            </section>

            {/* Recent jobs section */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                Recente opdrachten
              </h2>

              {recentJobs.length === 0 ? (
                <div className="card card-gradient text-center py-8 animate-scale-in">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-secondary mb-4">Nog geen opdrachten</p>
                  <Link href="/dashboard/jobs/new">
                    <button className="btn btn-primary">
                      Plaats je eerste opdracht
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="desktop-grid-2 stagger-animate">
                  {recentJobs.map((job) => {
                    const isOwner = job.createdById === session.user?.id;
                    return (
                      <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                        <div className="job-card cursor-pointer h-full">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {job.company?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-white font-semibold truncate">
                                  {job.title}
                                </h3>
                                {isOwner && (
                                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full shrink-0">
                                    Jouw opdracht
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary mb-2">{job.company}</p>
                              <div className="flex items-center gap-2 text-xs text-tertiary flex-wrap">
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
                                <p className="text-xs text-tertiary mt-2 truncate">
                                  In: {job.shares.map((s) => s.group.name).join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
