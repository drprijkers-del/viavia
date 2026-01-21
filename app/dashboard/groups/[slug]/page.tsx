import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import CopyButton from "@/app/components/CopyButton";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const isAdmin = role === "ADMIN";
  const inviteUrl = `${process.env.NEXTAUTH_URL}/join/${group.inviteToken}`;

  return (
    <div className="app-frame">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <ViaViaLogo size="sm" />
        <Link href="/dashboard">
          <button className="text-sm text-muted hover:text-white transition-colors">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Group Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
        <p className="text-xs text-tertiary">
          {group.jobShares.length} {group.jobShares.length === 1 ? 'opdracht' : 'opdrachten'}
          {isAdmin && <span className="text-accent"> · Je bent admin</span>}
        </p>
      </div>

      {/* Invite Link */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-3">Uitnodigingslink</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="input flex-1 text-sm"
          />
          <CopyButton text={inviteUrl} />
        </div>
        <p className="text-xs text-tertiary mt-3">
          Deel deze link in je WhatsApp-groep zodat anderen kunnen toetreden
        </p>
      </div>

      {/* Members */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Leden ({group.members.length})
        </h2>
        <div className="space-y-2">
          {group.members.map((member) => (
            <div key={member.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p>{member.user.name || member.user.email}</p>
                  {member.role === "ADMIN" && (
                    <p className="text-xs text-tertiary">Admin</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Opdrachten in deze groep
        </h2>
        {group.jobShares.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted mb-4">Nog geen opdrachten gedeeld</p>
            <Link href="/dashboard/jobs/new">
              <button className="btn btn-primary text-sm">
                + Nieuwe opdracht
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {group.jobShares.map(({ job }) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <div className="job-card">
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-muted mb-2">{job.company}</p>
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
  );
}
