import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ViaViaLogo from "@/app/components/ViaViaLogo";
import Link from "next/link";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { name: true, email: true }
      },
      shares: {
        include: {
          group: {
            select: { name: true, slug: true }
          }
        }
      }
    }
  });

  if (!job) notFound();

  const hasAccess =
    session.user.id === job.createdById ||
    (await prisma.groupMember.findFirst({
      where: {
        userId: session.user.id,
        groupId: { in: job.shares.map(s => s.groupId) }
      }
    }));

  if (!hasAccess) notFound();

  const isOwner = session.user.id === job.createdById;

  // Format phone number for WhatsApp (needs international format)
  let phoneNumber = job.posterWhatsapp.replace(/\D/g, "");
  // If Dutch number starting with 0, replace with 31
  if (phoneNumber.startsWith("0") && phoneNumber.length === 10) {
    phoneNumber = "31" + phoneNumber.slice(1);
  }
  // If number doesn't have country code, assume Dutch
  if (phoneNumber.length === 9) {
    phoneNumber = "31" + phoneNumber;
  }

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    `Hey ${job.posterName}! Ik ben geïnteresseerd in de opdracht "${job.title}" bij ${job.company}. Kunnen we hierover praten?`
  )}`;

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

        <div className="max-w-2xl mx-auto">
          <div className="card mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
            <p className="text-lg text-secondary mb-4">{job.company}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-accent font-semibold">€{job.rate}/uur</span>
              </div>
              <span className="text-tertiary">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white">{job.locationType}</span>
                {job.locationDetail && <span className="text-tertiary">({job.locationDetail})</span>}
              </div>
              {job.hoursPerWeek && (
                <>
                  <span className="text-tertiary">•</span>
                  <span className="text-white">{job.hoursPerWeek}u/week</span>
                </>
              )}
              {job.months && (
                <>
                  <span className="text-tertiary">•</span>
                  <span className="text-white">{job.months} maanden</span>
                </>
              )}
              {job.teamSize && (
                <>
                  <span className="text-tertiary">•</span>
                  <span className="text-white">Team: {job.teamSize}</span>
                </>
              )}
            </div>

            <p className="text-white leading-relaxed whitespace-pre-wrap mb-6">
              {job.description}
            </p>

            {job.shares.length > 0 && (
              <p className="text-xs text-tertiary mb-4">
                Gedeeld in: {job.shares.map(s => s.group.name).join(", ")}
              </p>
            )}

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-primary w-full py-4 text-lg">
                Reageer via WhatsApp
              </button>
            </a>
          </div>

          {isOwner && (
            <div className="space-y-3">
              <Link href={`/dashboard/jobs/${job.id}/share`}>
                <button className="btn btn-secondary w-full">
                  Deel in meer groepen
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
