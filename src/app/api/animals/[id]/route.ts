import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { animalSchema, normalizeBreedingData } from "@/lib/validation";
import { formDataToRecord, saveUploadedImage } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const pedigreeInclude = {
  sire: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  dam: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  exposedToBuck: true,
  treatments: { orderBy: { date: "desc" as const } },
  sired: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] },
  birthed: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] }
};

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const animal = await prisma.animal.findUnique({ where: { id }, include: pedigreeInclude });
  if (!animal) return NextResponse.json({ error: "Animal not found." }, { status: 404 });
  return NextResponse.json(animal);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const formData = await request.formData();
    const file = formData.get("photo") instanceof File ? (formData.get("photo") as File) : null;
    const uploadedUrl = await saveUploadedImage(file);
    const currentPhotoUrl = formData.get("currentPhotoUrl")?.toString() || null;
    const parsed = normalizeBreedingData(animalSchema.parse({ ...formDataToRecord(formData), photoUrl: uploadedUrl || currentPhotoUrl }));

    if (parsed.sireId === id || parsed.damId === id || parsed.exposedToBuckId === id) {
      return NextResponse.json({ error: "An animal cannot be its own parent or breeding buck." }, { status: 400 });
    }
    if (parsed.sireId && parsed.sireId === parsed.damId) {
      return NextResponse.json({ error: "Sire and dam must be different animals." }, { status: 400 });
    }

    const animal = await prisma.animal.update({ where: { id }, data: parsed, include: pedigreeInclude });
    return NextResponse.json(animal);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That tag code is already in use." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Unable to update animal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.animal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
