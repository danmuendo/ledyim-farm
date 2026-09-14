import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimalForm } from "@/components/AnimalForm";
import { PedigreeTree } from "@/components/PedigreeTree";
import { TreatmentManager } from "@/components/TreatmentManager";
import { prisma } from "@/lib/prisma";
import { animalLabel, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const pedigreeInclude = {
  sire: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  dam: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  treatments: { orderBy: { date: "desc" as const } },
  sired: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] },
  birthed: { orderBy: [{ species: "asc" as const }, { dateOfBirth: "asc" as const }] }
};

export default async function AnimalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [animal, allAnimals] = await Promise.all([
    prisma.animal.findUnique({ where: { id }, include: pedigreeInclude }),
    prisma.animal.findMany({ orderBy: { tagCode: "asc" } })
  ]);
  if (!animal) notFound();

  const offspring = [...animal.sired, ...animal.birthed].sort((a, b) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime());

  return (
    <div className="space-y-6">
      <Link href="/animals" className="text-sm font-medium text-field-moss">Back to animals</Link>
      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-soft">
          <div className="relative aspect-[4/3] bg-field-mist">{animal.photoUrl ? <Image src={animal.photoUrl} alt={animalLabel(animal)} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" /> : <div className="flex h-full items-center justify-center font-semibold uppercase text-field-moss">{animal.species}</div>}</div>
          <div className="space-y-2 p-4"><h1 className="text-2xl font-bold text-field-ink">{animalLabel(animal)}</h1><p className="capitalize text-stone-700">{animal.species} - {animal.sex} - {animal.status}</p><p className="text-sm text-stone-600">Born {formatDate(animal.dateOfBirth)}</p><p className="text-sm text-stone-600">Sire: {animal.sire ? animalLabel(animal.sire) : "Unknown"}</p><p className="text-sm text-stone-600">Dam: {animal.dam ? animalLabel(animal.dam) : "Unknown"}</p>{animal.notes && <p className="border-t border-stone-200 pt-3 text-sm text-stone-700">{animal.notes}</p>}</div>
        </div>
        <div className="space-y-3"><h2 className="section-title">Edit Details</h2><AnimalForm animal={animal} animals={allAnimals} /></div>
      </section>
      <TreatmentManager animalId={animal.id} initialTreatments={animal.treatments} />
      <PedigreeTree animal={animal} offspring={offspring} />
    </div>
  );
}

