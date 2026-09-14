import Link from "next/link";
import { Baby, GitBranch, UserRound } from "lucide-react";
import { animalLabel, formatDate } from "@/lib/format";
import { AnimalOption, PedigreeAnimal } from "@/lib/types";

function TreeNode({ animal, depth = 0, role = "Animal" }: { animal: PedigreeAnimal | null | undefined; depth?: number; role?: string }) {
  if (!animal || depth > 3) {
    return <div className="tree-box border-dashed bg-field-mist/60 text-stone-400"><span className="text-xs font-bold uppercase tracking-wide">{role}</span><span>Unknown</span></div>;
  }

  const hasParents = depth < 3 && (animal.sire || animal.dam);

  return (
    <div className="flex flex-col items-center gap-3">
      <Link href={`/animals/${animal.id}`} className="tree-box hover:-translate-y-0.5 hover:border-field-grass hover:shadow-soft">
        <span className="mb-1 text-xs font-bold uppercase tracking-wide text-field-moss/70">{role}</span>
        <span className="font-black text-field-soil">{animalLabel(animal)}</span>
        <span className="text-xs capitalize text-stone-500">{animal.species} / {animal.sex}</span>
      </Link>
      {hasParents && (
        <div className="flex w-full flex-col items-center gap-3">
          <div className="h-5 border-l border-field-moss/25" />
          <div className="grid w-full min-w-[22rem] grid-cols-2 gap-3 border-t border-field-moss/25 pt-3">
            <TreeNode animal={animal.sire} depth={depth + 1} role="Sire" />
            <TreeNode animal={animal.dam} depth={depth + 1} role="Dam" />
          </div>
        </div>
      )}
    </div>
  );
}

export function PedigreeTree({ animal, offspring }: { animal: PedigreeAnimal; offspring: AnimalOption[] }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Lineage</p><h2 className="section-title">Family Tree</h2></div><span className="badge"><GitBranch size={14} /> 3 generations</span></div>
      <details open className="surface overflow-hidden">
        <summary className="cursor-pointer border-b border-field-moss/10 bg-field-mist/50 px-4 py-3 font-bold text-field-soil">Pedigree</summary>
        <div className="overflow-x-auto p-5 pb-6">
          <TreeNode animal={animal} role="Current" />
        </div>
      </details>
      <div className="surface p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2"><Baby size={18} className="text-field-moss" /><h3 className="font-black text-field-soil">Offspring</h3></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {offspring.map((child) => (
            <Link key={child.id} href={`/animals/${child.id}`} className="group rounded-lg border border-field-moss/10 bg-white/75 p-3 transition hover:border-field-grass hover:bg-white hover:shadow-soft">
              <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-field-mist text-field-moss"><UserRound size={17} /></span><div><p className="font-bold text-field-soil">{animalLabel(child)}</p><p className="text-sm text-stone-600">Born {formatDate(child.dateOfBirth)}</p></div></div>
            </Link>
          ))}
        </div>
        {offspring.length === 0 && <p className="surface-muted p-5 text-sm text-field-soil/70">No offspring linked yet.</p>}
      </div>
    </section>
  );
}
