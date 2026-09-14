import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = new Date();
  const next30 = new Date(today);
  next30.setDate(today.getDate() + 30);

  const [totalCattle, totalGoats, upcomingTreatments, recentlyAddedAnimals] = await Promise.all([
    prisma.animal.count({ where: { species: "cattle" } }),
    prisma.animal.count({ where: { species: "goat" } }),
    prisma.treatmentRecord.findMany({
      where: { nextDueDate: { gte: today, lte: next30 } },
      orderBy: { nextDueDate: "asc" },
      include: { animal: true },
      take: 8
    }),
    prisma.animal.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  return NextResponse.json({ totalCattle, totalGoats, upcomingTreatments, recentlyAddedAnimals });
}
