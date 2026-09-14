import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { treatmentSchema } from "@/lib/validation";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data = treatmentSchema.parse(body);
    const treatment = await prisma.treatmentRecord.update({ where: { id }, data });
    return NextResponse.json(treatment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update treatment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.treatmentRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
