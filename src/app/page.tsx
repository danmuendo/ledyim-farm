import Image from "next/image";
import Link from "next/link";
import { Activity, Baby, CalendarClock, ChevronRight, ClipboardPlus, Plus, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { animalLabel, breedingStatusLabel, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date();
  const next30 = new Date(today);
  next30.setDate(today.getDate() + 30);

  const [totalCattle, totalGoats, upcomingTreatments, recentlyAddedAnimals, activeAnimals, goatBreedingQueue, pregnantGoats, delayedGoats] = await Promise.all([
    prisma.animal.count({ where: { species: "cattle" } }),
    prisma.animal.count({ where: { species: "goat" } }),
    prisma.treatmentRecord.findMany({
      where: { nextDueDate: { gte: today, lte: next30 } },
      orderBy: { nextDueDate: "asc" },
      include: { animal: true },
      take: 8
    }),
    prisma.animal.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.animal.count({ where: { status: "active" } }),
    prisma.animal.findMany({
      where: { species: "goat", sex: "female", goatBreedingStatus: { in: ["pregnant", "delayed", "exposed"] } },
      include: { exposedToBuck: true },
      orderBy: [{ expectedKiddingDate: "asc" }, { tagCode: "asc" }],
      take: 8
    }),
    prisma.animal.count({ where: { species: "goat", sex: "female", goatBreedingStatus: "pregnant" } }),
    prisma.animal.count({ where: { species: "goat", sex: "female", goatBreedingStatus: "delayed" } })
  ]);

  const stats = [
    { label: "Cattle", value: totalCattle, detail: "larger stock", icon: Activity, tone: "bg-field-moss text-white" },
    { label: "Goats", value: totalGoats, detail: "small stock", icon: ShieldCheck, tone: "bg-field-clay text-white" },
    { label: "Pregnant", value: pregnantGoats, detail: "goats tracked", icon: Baby, tone: "bg-field-sky text-field-soil" },
    { label: "Delayed", value: delayedGoats, detail: "needs follow-up", icon: CalendarClock, tone: "bg-field-straw text-field-soil" },
    { label: "Due Soon", value: upcomingTreatments.length, detail: "treatments", icon: CalendarClock, tone: "bg-field-straw text-field-soil" },
    { label: "Active", value: activeAnimals, detail: "on the farm", icon: ClipboardPlus, tone: "bg-field-sky text-field-soil" }
  ];

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-xl border border-white/80 bg-field-soil text-white shadow-lift">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="flex min-h-56 flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="eyebrow text-field-straw">Today on the farm</p>
              <div className="space-y-3"><h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Livestock records that are quick enough for field work.</h1><p className="max-w-xl text-sm leading-6 text-white/75 sm:text-base">Track cattle and goats, keep treatment reminders visible, and follow breeding status for pregnant or delayed does.</p></div>
            </div>
            <div className="flex flex-wrap gap-3"><Link href="/animals/new" className="button-primary bg-field-straw text-field-soil hover:bg-white"><Plus size={17} /> Add animal</Link><Link href="/animals" className="button-secondary border-white/20 bg-white/10 text-white hover:bg-white/15"><ClipboardPlus size={17} /> View herd</Link></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:content-end">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return <div key={stat.label} className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur"><div className={`mb-5 grid h-10 w-10 place-items-center rounded-md ${stat.tone}`}><Icon size={19} /></div><p className="text-3xl font-black">{stat.value}</p><p className="text-sm font-semibold text-white/80">{stat.label}</p><p className="text-xs text-white/55">{stat.detail}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="surface p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="eyebrow">Breeding watch</p><h2 className="section-title">Goat Pregnancy Queue</h2></div><span className="badge-warm">{goatBreedingQueue.length} tracked</span></div>
          <div className="divide-y divide-field-moss/10">
            {goatBreedingQueue.map((goat) => <Link key={goat.id} href={`/animals/${goat.id}`} className="group flex items-center justify-between gap-3 py-3"><div><p className="font-bold text-field-soil">{animalLabel(goat)}</p><p className="text-sm text-stone-600">{breedingStatusLabel(goat.goatBreedingStatus)}{goat.exposedToBuck ? ` with ${animalLabel(goat.exposedToBuck)}` : ""}</p><p className="text-xs text-field-moss">Expected kidding: {formatDate(goat.expectedKiddingDate)}</p></div><ChevronRight className="text-field-moss transition group-hover:translate-x-1" size={18} /></Link>)}
            {goatBreedingQueue.length === 0 && <div className="surface-muted p-5 text-sm text-field-soil/70">No pregnant, exposed, or delayed goats are currently tracked.</div>}
          </div>
        </div>
        <div className="surface p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="eyebrow">Health queue</p><h2 className="section-title">Upcoming Treatments</h2></div><span className="badge-warm">{upcomingTreatments.length} due</span></div>
          <div className="divide-y divide-field-moss/10">
            {upcomingTreatments.map((item) => <Link key={item.id} href={`/animals/${item.animalId}`} className="group flex items-center justify-between gap-3 py-3"><div><p className="font-bold capitalize text-field-soil">{item.type} for {animalLabel(item.animal)}</p><p className="text-sm text-stone-600">Due {formatDate(item.nextDueDate)}</p></div><ChevronRight className="text-field-moss transition group-hover:translate-x-1" size={18} /></Link>)}
            {upcomingTreatments.length === 0 && <div className="surface-muted p-5 text-sm text-field-soil/70">No treatment reminders due in the next 30 days.</div>}
          </div>
        </div>
      </section>

      <section className="surface p-4 sm:p-5">
        <div className="mb-4"><p className="eyebrow">Newest records</p><h2 className="section-title">Recently Added</h2></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recentlyAddedAnimals.map((animal) => <Link key={animal.id} href={`/animals/${animal.id}`} className="group grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-lg border border-field-moss/10 bg-white/70 p-2 transition hover:border-field-grass hover:bg-white"><div className="relative h-16 w-16 overflow-hidden rounded-md bg-field-mist">{animal.photoUrl ? <Image src={animal.photoUrl} alt={animalLabel(animal)} fill sizes="64px" className="object-cover" /> : <div className="grid h-full place-items-center text-xs font-black uppercase text-field-moss">{animal.species.slice(0, 1)}</div>}</div><div><p className="font-bold text-field-soil">{animalLabel(animal)}</p><p className="text-sm capitalize text-stone-600">{animal.species} - born {formatDate(animal.dateOfBirth)}</p></div><ChevronRight className="text-field-moss transition group-hover:translate-x-1" size={18} /></Link>)}
          {recentlyAddedAnimals.length === 0 && <p className="surface-muted p-5 text-sm text-field-soil/70">No animals yet. Add your first one.</p>}
        </div>
      </section>
    </div>
  );
}
