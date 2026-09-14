"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimalOption } from "@/lib/types";
import { animalLabel, formatDate, speciesRank } from "@/lib/format";

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
      <div className="grid gap-3 rounded-md border border-stone-200 bg-white p-3 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="Search name or tag" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className="input" value={species} onChange={(event) => setSpecies(event.target.value)}>
          <option value="">All species</option><option value="cattle">Cattle</option><option value="goat">Goats</option>
        </select>
        <select className="input" value={sex} onChange={(event) => setSex(event.target.value)}>
          <option value="">All sex</option><option value="female">Female</option><option value="male">Male</option>
        </select>
        <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All status</option><option value="active">Active</option><option value="sold">Sold</option><option value="deceased">Deceased</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((animal) => (
          <Link key={animal.id} href={`/animals/${animal.id}`} className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-field-grass">
            <div className="relative aspect-[4/3] bg-field-mist">
              {animal.photoUrl ? <Image src={animal.photoUrl} alt={animalLabel(animal)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm font-semibold uppercase tracking-wide text-field-moss">{animal.species}</div>}
            </div>
            <div className="space-y-1 p-4">
              <div className="flex items-start justify-between gap-2"><h2 className="font-semibold text-field-ink">{animalLabel(animal)}</h2><span className="rounded bg-field-mist px-2 py-1 text-xs capitalize text-field-moss">{animal.status}</span></div>
              <p className="text-sm text-stone-600">Born {formatDate(animal.dateOfBirth)}</p>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="rounded-md border border-dashed border-stone-300 p-8 text-center text-stone-600">No animals match those filters.</p>}
    </div>
  );
}
