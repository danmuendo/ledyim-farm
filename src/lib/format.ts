import { GoatBreedingStatus } from "@/lib/types";

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

export function animalLabel(animal: { name: string | null; tagCode: string }) {
  return animal.name ? `${animal.name} (${animal.tagCode})` : animal.tagCode;
}

export function speciesRank(species: string) {
  return species === "cattle" ? 0 : 1;
}

export function breedingStatusLabel(status: GoatBreedingStatus | null | undefined) {
  if (!status) return "Not tracked";
  const labels: Record<GoatBreedingStatus, string> = {
    open: "Open",
    exposed: "Exposed",
    pregnant: "Pregnant",
    delayed: "Delayed",
    kidded: "Kidded",
    resting: "Resting"
  };
  return labels[status];
}
