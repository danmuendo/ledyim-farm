import Link from "next/link";
import { Plus } from "lucide-react";
import { AnimalGrid } from "@/components/AnimalGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnimalsPage() {
  const animals = await prisma.animal.findMany({ orderBy: [{ species: "asc" }, { dateOfBirth: "asc" }, { tagCode: "asc" }] });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2"><p className="eyebrow">Herd book</p><h1 className="text-3xl font-black text-field-soil">Animals</h1><p className="max-w-2xl text-sm leading-6 text-stone-600">Browse cattle first, then goats, with the oldest animals shown first inside each species.</p></div>
        <Link href="/animals/new" className="button-primary"><Plus size={17} /> Add animal</Link>
      </div>
      <AnimalGrid animals={animals} />
    </div>
  );
}
