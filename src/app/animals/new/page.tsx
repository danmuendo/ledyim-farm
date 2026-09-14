import Link from "next/link";
import { AnimalForm } from "@/components/AnimalForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewAnimalPage() {
  const animals = await prisma.animal.findMany({ orderBy: [{ tagCode: "asc" }] });
  return (
    <div className="space-y-5">
      <div><Link href="/animals" className="text-sm font-medium text-field-moss">Back to animals</Link><h1 className="mt-2 text-2xl font-bold text-field-ink">Add Animal</h1></div>
      <AnimalForm animals={animals} />
    </div>
  );
}
