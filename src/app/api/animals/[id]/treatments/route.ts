import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { treatmentSchema } from "@/lib/validation";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data = treatmentSchema.parse(body);
    const treatment = await prisma.treatmentRecord.create({ data: { ...data, animalId: id } });
    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add treatment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
