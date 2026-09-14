import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { animalLabel, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date();
  const next30 = new Date(today);
  next30.setDate(today.getDate() + 30);

  const [totalCattle, totalGoats, upcomingTreatments, recentlyAddedAnimals] = await Promise.all([
    prisma.animal.count({ where: { species: "cattle" } }),
    prisma.animal.count({ where: { species: "goat" } }),
    prisma.treatmentRecord.findMany({
      where: { nextDueDate: { gte: today, lte: next30 } },
      orderBy: { nextDueDate: "asc" },
      include: { animal: true },
      take: 8
    }),
    prisma.animal.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-field-ink">Farm Dashboard</h1><p className="text-sm text-stone-600">Livestock records for cattle and goats.</p></div>
        <Link href="/animals/new" className="button-primary">Add animal</Link>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft"><p className="text-sm text-stone-500">Total cattle</p><p className="mt-2 text-3xl font-bold">{totalCattle}</p></div>
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft"><p className="text-sm text-stone-500">Total goats</p><p className="mt-2 text-3xl font-bold">{totalGoats}</p></div>
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft"><p className="text-sm text-stone-500">Treatments due soon</p><p className="mt-2 text-3xl font-bold">{upcomingTreatments.length}</p></div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft">
          <h2 className="section-title mb-3">Upcoming Treatments</h2>
          <div className="space-y-3">
            {upcomingTreatments.map((item) => <Link key={item.id} href={`/animals/${item.animalId}`} className="block rounded border border-stone-200 p-3 hover:border-field-grass"><p className="font-medium capitalize">{item.type} for {animalLabel(item.animal)}</p><p className="text-sm text-stone-600">Due {formatDate(item.nextDueDate)}</p></Link>)}
            {upcomingTreatments.length === 0 && <p className="text-sm text-stone-600">No treatment reminders due in the next 30 days.</p>}
          </div>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft">
          <h2 className="section-title mb-3">Recently Added</h2>
          <div className="space-y-3">
            {recentlyAddedAnimals.map((animal) => <Link key={animal.id} href={`/animals/${animal.id}`} className="block rounded border border-stone-200 p-3 hover:border-field-grass"><p className="font-medium">{animalLabel(animal)}</p><p className="text-sm capitalize text-stone-600">{animal.species} - born {formatDate(animal.dateOfBirth)}</p></Link>)}
            {recentlyAddedAnimals.length === 0 && <p className="text-sm text-stone-600">No animals yet. Add your first one.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
