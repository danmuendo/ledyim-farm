import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { animalSchema, normalizeBreedingData } from "@/lib/validation";
import { formDataToRecord, saveUploadedImage } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const animalInclude = {
  sire: true,
  dam: true,
  exposedToBuck: true,
  treatments: { orderBy: { date: "desc" as const } },
  sired: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] },
  birthed: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species") || undefined;
  const sex = searchParams.get("sex") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search")?.trim();

  const where: Prisma.AnimalWhereInput = {
    ...(species ? { species: species as Prisma.EnumSpeciesFilter<"Animal"> } : {}),
    ...(sex ? { sex: sex as Prisma.EnumSexFilter<"Animal"> } : {}),
    ...(status ? { status: status as Prisma.EnumAnimalStatusFilter<"Animal"> } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { tagCode: { contains: search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const animals = await prisma.animal.findMany({
    where,
    orderBy: [{ species: "asc" }, { dateOfBirth: "asc" }, { tagCode: "asc" }],
    include: { sire: true, dam: true, exposedToBuck: true }
  });

  return NextResponse.json(animals);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") instanceof File ? (formData.get("photo") as File) : null;
    const photoUrl = await saveUploadedImage(file);
    const parsed = normalizeBreedingData(animalSchema.parse({ ...formDataToRecord(formData), photoUrl }));

    if (parsed.sireId && parsed.sireId === parsed.damId) {
      return NextResponse.json({ error: "Sire and dam must be different animals." }, { status: 400 });
    }

    const animal = await prisma.animal.create({ data: parsed, include: animalInclude });
    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That tag code is already in use." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Unable to create animal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
