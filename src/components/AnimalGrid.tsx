"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimalOption } from "@/lib/types";
import { animalLabel, breedingStatusLabel, formatDate, speciesRank } from "@/lib/format";

export function AnimalGrid({ animals }: { animals: AnimalOption[] }) {
  const [species, setSpecies] = useState("");
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return animals
      .filter((animal) => !species || animal.species === species)
      .filter((animal) => !sex || animal.sex === sex)
      .filter((animal) => !status || animal.status === status)
      .filter((animal) => {
        if (!needle) return true;
        return `${animal.name ?? ""} ${animal.tagCode}`.toLowerCase().includes(needle);
      })
      .sort((a, b) => {
        const bySpecies = speciesRank(a.species) - speciesRank(b.species);
        if (bySpecies) return bySpecies;
        return new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
      });
  }, [animals, search, sex, species, status]);

  return (
    <div className="space-y-5">
      <div className="surface p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-field-soil"><SlidersHorizontal size={17} /> Filters</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-field-moss/65" size={17} /><input className="input pl-9" placeholder="Search name or tag" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <select className="input" value={species} onChange={(event) => setSpecies(event.target.value)}><option value="">All species</option><option value="cattle">Cattle</option><option value="goat">Goats</option></select>
          <select className="input" value={sex} onChange={(event) => setSex(event.target.value)}><option value="">All sex</option><option value="female">Female</option><option value="male">Male</option></select>
          <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All status</option><option value="active">Active</option><option value="sold">Sold</option><option value="deceased">Deceased</option></select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-field-soil/70"><span>{filtered.length} of {animals.length} animals</span><span className="hidden sm:inline">Cattle before goats - oldest first</span></div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((animal) => (
          <Link key={animal.id} href={`/animals/${animal.id}`} className="group overflow-hidden rounded-xl border border-white/80 bg-white/90 shadow-soft ring-1 ring-field-soil/5 transition hover:-translate-y-1 hover:shadow-lift">
            <div className="relative aspect-[4/3] bg-field-mist">
              {animal.photoUrl ? <Image src={animal.photoUrl} alt={animalLabel(animal)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-field-mist to-white text-field-moss"><span className="text-4xl font-black uppercase">{animal.species.slice(0, 1)}</span><span className="text-xs font-bold uppercase tracking-[0.18em]">{animal.species}</span></div>}
              <div className="absolute left-3 top-3 flex gap-2"><span className="badge bg-white/90">{animal.species}</span><span className="badge-warm bg-white/90">{animal.status}</span>{animal.species === "goat" && animal.sex === "female" && animal.goatBreedingStatus && <span className="badge bg-white/90">{breedingStatusLabel(animal.goatBreedingStatus)}</span>}</div>
            </div>
            <div className="space-y-3 p-4">
              <div><h2 className="text-lg font-black leading-tight text-field-soil">{animal.name || animal.tagCode}</h2>{animal.name && <p className="text-sm font-semibold text-field-moss">{animal.tagCode}</p>}</div>
              <div className="grid grid-cols-2 gap-2 text-sm"><div className="surface-muted px-3 py-2"><p className="text-xs font-bold uppercase text-field-moss/70">Born</p><p className="font-semibold text-field-soil">{formatDate(animal.dateOfBirth)}</p></div><div className="surface-muted px-3 py-2"><p className="text-xs font-bold uppercase text-field-moss/70">Sex</p><p className="font-semibold capitalize text-field-soil">{animal.sex}</p></div></div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="surface border-dashed p-8 text-center text-stone-600">No animals match those filters.</p>}
    </div>
  );
}

