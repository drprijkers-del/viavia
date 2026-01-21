import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Verify user has access to selected groups
  if (data.groupIds && data.groupIds.length > 0) {
    const membershipCount = await prisma.groupMember.count({
      where: {
        userId: session.user.id,
        groupId: { in: data.groupIds }
      }
    });

    if (membershipCount !== data.groupIds.length) {
      return NextResponse.json({ error: "Invalid group access" }, { status: 403 });
    }
  }

  // Create job with shares in selected groups
  const job = await prisma.job.create({
    data: {
      createdById: session.user.id,
      title: data.title,
      company: data.company,
      description: data.description,
      rate: data.rate,
      locationType: data.locationType,
      locationDetail: data.locationDetail || null,
      hoursPerWeek: data.hoursPerWeek || null,
      months: data.months || null,
      teamSize: data.teamSize || null,
      posterName: data.posterName,
      posterWhatsapp: data.posterWhatsapp,
      // Create shares for selected groups
      shares: data.groupIds && data.groupIds.length > 0 ? {
        create: data.groupIds.map((groupId: string) => ({
          groupId
        }))
      } : undefined
    },
    include: {
      shares: {
        include: {
          group: {
            select: { name: true, slug: true }
          }
        }
      }
    }
  });

  return NextResponse.json({ job });
}
