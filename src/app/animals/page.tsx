import Link from "next/link";
import { AnimalGrid } from "@/components/AnimalGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnimalsPage() {
  const animals = await prisma.animal.findMany({ orderBy: [{ species: "asc" }, { dateOfBirth: "asc" }, { tagCode: "asc" }] });
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-field-ink">Animals</h1><p className="text-sm text-stone-600">Cattle are shown before goats, oldest first.</p></div>
        <Link href="/animals/new" className="button-primary">Add animal</Link>
      </div>
      <AnimalGrid animals={animals} />
    </div>
  );
}
