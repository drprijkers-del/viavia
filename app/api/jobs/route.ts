import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

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
    }
  });

  return NextResponse.json({ job });
}
