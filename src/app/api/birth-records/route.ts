import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { birthRecordSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const records = await prisma.birthRecord.findMany({
    orderBy: { birthDate: "desc" },
    include: { dam: true, sire: true, offspring: { include: { animal: true } } }
  });
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = birthRecordSchema.parse(body);
    const record = await prisma.birthRecord.create({
      data: {
        damId: data.damId,
        sireId: data.sireId,
        birthDate: data.birthDate,
        notes: data.notes,
        offspring: { create: data.offspringIds.map((animalId) => ({ animalId })) }
      },
      include: { dam: true, sire: true, offspring: { include: { animal: true } } }
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save birth record.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
