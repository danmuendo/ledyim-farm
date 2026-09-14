import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimalForm } from "@/components/AnimalForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewAnimalPage() {
  const animals = await prisma.animal.findMany({ orderBy: [{ tagCode: "asc" }] });
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/animals" className="inline-flex items-center gap-2 text-sm font-bold text-field-moss"><ArrowLeft size={16} /> Back to animals</Link>
      <div className="space-y-2"><p className="eyebrow">New record</p><h1 className="text-3xl font-black text-field-soil">Add Animal</h1><p className="max-w-2xl text-sm leading-6 text-stone-600">Create the core record first. Parents and notes can be filled in now or updated later from the animal profile.</p></div>
      <AnimalForm animals={animals} />
    </div>
  );
}
