import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Baby, CalendarDays, HeartPulse, Pencil, Tag, UsersRound } from "lucide-react";
import { AnimalForm } from "@/components/AnimalForm";
import { PedigreeTree } from "@/components/PedigreeTree";
import { TreatmentManager } from "@/components/TreatmentManager";
import { prisma } from "@/lib/prisma";
import { animalLabel, breedingStatusLabel, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const pedigreeInclude = {
  sire: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  dam: { include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } } },
  exposedToBuck: true,
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
  const latestTreatment = animal.treatments[0];
  const showBreeding = animal.species === "goat" && animal.sex === "female";

  return (
    <div className="space-y-7">
      <Link href="/animals" className="inline-flex items-center gap-2 text-sm font-bold text-field-moss"><ArrowLeft size={16} /> Back to animals</Link>
      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="surface overflow-hidden">
          <div className="relative aspect-[4/3] bg-field-mist">{animal.photoUrl ? <Image src={animal.photoUrl} alt={animalLabel(animal)} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-field-mist to-white text-field-moss"><span className="text-6xl font-black uppercase">{animal.species.slice(0, 1)}</span><span className="text-xs font-bold uppercase tracking-[0.18em]">{animal.species}</span></div>}<div className="absolute left-4 top-4 flex flex-wrap gap-2"><span className="badge bg-white/90">{animal.species}</span><span className="badge-warm bg-white/90">{animal.status}</span>{showBreeding && animal.goatBreedingStatus && <span className="badge bg-white/90">{breedingStatusLabel(animal.goatBreedingStatus)}</span>}</div></div>
          <div className="space-y-5 p-5">
            <div><p className="eyebrow">Animal profile</p><h1 className="mt-1 text-3xl font-black text-field-soil">{animal.name || animal.tagCode}</h1>{animal.name && <p className="mt-1 text-lg font-bold text-field-moss">{animal.tagCode}</p>}</div>
            <div className="grid grid-cols-2 gap-3"><div className="surface-muted p-3"><Tag className="mb-2 text-field-moss" size={18} /><p className="text-xs font-bold uppercase text-field-moss/70">Sex</p><p className="font-black capitalize text-field-soil">{animal.sex}</p></div><div className="surface-muted p-3"><CalendarDays className="mb-2 text-field-moss" size={18} /><p className="text-xs font-bold uppercase text-field-moss/70">Born</p><p className="font-black text-field-soil">{formatDate(animal.dateOfBirth)}</p></div><div className="surface-muted p-3"><UsersRound className="mb-2 text-field-moss" size={18} /><p className="text-xs font-bold uppercase text-field-moss/70">Offspring</p><p className="font-black text-field-soil">{offspring.length}</p></div><div className="surface-muted p-3"><HeartPulse className="mb-2 text-field-moss" size={18} /><p className="text-xs font-bold uppercase text-field-moss/70">Last care</p><p className="font-black text-field-soil">{latestTreatment ? formatDate(latestTreatment.date) : "None"}</p></div></div>
            {showBreeding && <div className="rounded-lg border border-field-straw/35 bg-field-straw/15 p-4"><div className="mb-3 flex items-center gap-2"><Baby size={18} className="text-field-moss" /><p className="font-black text-field-soil">Goat breeding</p></div><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-bold text-field-moss">Status</dt><dd className="text-field-soil">{breedingStatusLabel(animal.goatBreedingStatus)}</dd></div><div><dt className="font-bold text-field-moss">Buck</dt><dd className="text-field-soil">{animal.exposedToBuck ? animalLabel(animal.exposedToBuck) : "Unknown"}</dd></div><div><dt className="font-bold text-field-moss">Bred/exposed</dt><dd className="text-field-soil">{formatDate(animal.lastBredDate)}</dd></div><div><dt className="font-bold text-field-moss">Expected kidding</dt><dd className="text-field-soil">{formatDate(animal.expectedKiddingDate)}</dd></div><div><dt className="font-bold text-field-moss">Pregnancy check</dt><dd className="text-field-soil">{formatDate(animal.pregnancyCheckDate)}</dd></div>{animal.breedingNotes && <div className="sm:col-span-2"><dt className="font-bold text-field-moss">Notes</dt><dd className="text-field-soil">{animal.breedingNotes}</dd></div>}</dl></div>}
            <div className="grid gap-2 text-sm"><p><b className="text-field-soil">Sire:</b> {animal.sire ? animalLabel(animal.sire) : "Unknown"}</p><p><b className="text-field-soil">Dam:</b> {animal.dam ? animalLabel(animal.dam) : "Unknown"}</p>{animal.notes && <p className="mt-2 rounded-lg bg-field-mist/70 p-3 leading-6 text-stone-700">{animal.notes}</p>}</div>
          </div>
        </div>
        <div className="space-y-3"><div className="flex items-center gap-2"><Pencil size={18} className="text-field-moss" /><h2 className="section-title">Edit Details</h2></div><AnimalForm animal={animal} animals={allAnimals} /></div>
      </section>
      <TreatmentManager animalId={animal.id} initialTreatments={animal.treatments} />
      <PedigreeTree animal={animal} offspring={offspring} />
    </div>
  );
}
