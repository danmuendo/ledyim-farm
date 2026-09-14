import Link from "next/link";
import { animalLabel, formatDate } from "@/lib/format";
import { AnimalOption, PedigreeAnimal } from "@/lib/types";

function TreeNode({ animal, depth = 0 }: { animal: PedigreeAnimal | null | undefined; depth?: number }) {
  if (!animal || depth > 3) {
    return <div className="tree-box border-dashed text-stone-400">Unknown</div>;
  }

  const hasParents = depth < 3 && (animal.sire || animal.dam);

  return (
    <div className="flex flex-col items-center gap-3">
      <Link href={`/animals/${animal.id}`} className="tree-box hover:border-field-grass">
        <span className="font-semibold text-field-ink">{animalLabel(animal)}</span>
        <span className="text-xs capitalize text-stone-500">{animal.species} / {animal.sex}</span>
      </Link>
      {hasParents && (
        <div className="flex w-full flex-col items-center gap-3">
          <div className="h-5 border-l border-stone-300" />
          <div className="grid w-full min-w-72 grid-cols-2 gap-3 border-t border-stone-300 pt-3">
            <TreeNode animal={animal.sire} depth={depth + 1} />
            <TreeNode animal={animal.dam} depth={depth + 1} />
          </div>
        </div>
      )}
    </div>
  );
}

export function PedigreeTree({ animal, offspring }: { animal: PedigreeAnimal; offspring: AnimalOption[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Family Tree</h2>
        <span className="text-sm text-stone-500">3 generations where known</span>
      </div>
      <details open className="rounded-md border border-stone-200 bg-white p-4 shadow-soft">
        <summary className="cursor-pointer font-semibold text-field-ink">Pedigree</summary>
        <div className="mt-5 overflow-x-auto pb-2">
          <TreeNode animal={animal} />
        </div>
      </details>
      <div className="rounded-md border border-stone-200 bg-white p-4 shadow-soft">
        <h3 className="mb-3 font-semibold text-field-ink">Offspring</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {offspring.map((child) => (
            <Link key={child.id} href={`/animals/${child.id}`} className="rounded border border-stone-200 p-3 hover:border-field-grass">
              <p className="font-medium text-field-ink">{animalLabel(child)}</p>
              <p className="text-sm text-stone-600">Born {formatDate(child.dateOfBirth)}</p>
            </Link>
          ))}
        </div>
        {offspring.length === 0 && <p className="text-sm text-stone-600">No offspring linked yet.</p>}
      </div>
    </section>
  );
}
