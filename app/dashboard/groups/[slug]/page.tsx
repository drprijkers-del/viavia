import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GroupDetailPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.groupMember.findFirst({
    where: {
      userId: session.user.id,
      group: { slug: params.slug }
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
  const isAdmin = role === "ADMIN";
  const inviteUrl = `${process.env.NEXTAUTH_URL}/join/${group.inviteToken}`;

  return (
    <div className="app-frame">
      <div className="app-container pb-24">
        <div className="flex items-center justify-between mb-8 mt-6">
          <ViaViaLogo size="sm" />
          <Link href="/dashboard">
            <button className="text-sm text-secondary hover:text-white transition-colors">
              ← Dashboard
            </button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
          <p className="text-xs text-tertiary">
            {group.jobShares.length} {group.jobShares.length === 1 ? 'opdracht' : 'opdrachten'}
            {isAdmin && " · Je bent admin"}
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Uitnodigingslink</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="input flex-1"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                alert("Link gekopieerd!");
              }}
              className="btn btn-secondary"
            >
              Kopieer
            </button>
          </div>
          <p className="text-xs text-tertiary mt-3">
            Deel deze link in je WhatsApp-groep zodat anderen kunnen toetreden
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Leden ({group.members.length})
          </h2>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{member.user.name || member.user.email}</p>
                    {member.role === "ADMIN" && (
                      <p className="text-xs text-tertiary">Admin</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Opdrachten in deze groep
          </h2>
          {group.jobShares.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-secondary mb-4">Nog geen opdrachten gedeeld</p>
              <Link href="/dashboard/jobs/new">
                <button className="btn btn-primary">
                  + Nieuwe opdracht
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {group.jobShares.map(({ job }) => (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <div className="job-card">
                    <h3 className="text-white font-semibold mb-1">{job.title}</h3>
                    <p className="text-sm text-secondary mb-2">{job.company}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-accent font-semibold">€{job.rate}/uur</span>
                      <span className="text-tertiary">•</span>
                      <span className="text-tertiary">{job.locationType}</span>
                      {job.hoursPerWeek && (
                        <>
                          <span className="text-tertiary">•</span>
                          <span className="text-tertiary">{job.hoursPerWeek}u/w</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
