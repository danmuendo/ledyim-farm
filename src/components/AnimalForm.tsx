"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Camera, HeartPulse, Save } from "lucide-react";
import { AnimalOption, GoatBreedingStatus } from "@/lib/types";
import { animalLabel } from "@/lib/format";

type AnimalFormValues = AnimalOption & {
  notes?: string | null;
  sireId?: string | null;
  damId?: string | null;
};

function toInputDate(value: string | Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

const breedingStatuses: { value: GoatBreedingStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "exposed", label: "Exposed to buck" },
  { value: "pregnant", label: "Pregnant" },
  { value: "delayed", label: "Delayed to conceive" },
  { value: "kidded", label: "Kidded" },
  { value: "resting", label: "Resting" }
];

export function AnimalForm({ animal, animals }: { animal?: AnimalFormValues; animals: AnimalOption[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const candidates = animals.filter((candidate) => candidate.id !== animal?.id);
  const bucks = candidates.filter((candidate) => candidate.species === "goat" && candidate.sex === "male");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    if (animal?.photoUrl) formData.set("currentPhotoUrl", animal.photoUrl);

    const response = await fetch(animal ? `/api/animals/${animal.id}` : "/api/animals", {
      method: animal ? "PATCH" : "POST",
      body: formData
    });

    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(payload.error || "Unable to save animal.");
      return;
    }
    router.push(`/animals/${payload.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface overflow-hidden">
      <div className="border-b border-field-moss/10 bg-field-mist/50 px-4 py-3 sm:px-5"><p className="text-sm font-bold text-field-soil">{animal ? "Update the animal record" : "Create a new animal record"}</p></div>
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 md:col-span-2">{error}</p>}
        <label className="field-label">Name<input name="name" className="input" defaultValue={animal?.name ?? ""} placeholder="Optional" /></label>
        <label className="field-label">Tag code<input name="tagCode" className="input" defaultValue={animal?.tagCode ?? ""} required maxLength={32} placeholder="C-015" /></label>
        <label className="field-label">Species<select name="species" className="input" defaultValue={animal?.species ?? "cattle"}><option value="cattle">Cattle</option><option value="goat">Goat</option></select></label>
        <label className="field-label">Sex<select name="sex" className="input" defaultValue={animal?.sex ?? "female"}><option value="female">Female</option><option value="male">Male</option></select></label>
        <label className="field-label">Date of birth<input name="dateOfBirth" type="date" className="input" defaultValue={toInputDate(animal?.dateOfBirth)} required /></label>
        <label className="field-label">Status<select name="status" className="input" defaultValue={animal?.status ?? "active"}><option value="active">Active</option><option value="sold">Sold</option><option value="deceased">Deceased</option></select></label>
        <label className="field-label">Sire<input className="input" list="sire-options" name="sireId" defaultValue={animal?.sireId ?? ""} placeholder="Search by tag, leave blank if unknown" /></label>
        <datalist id="sire-options">{candidates.filter((candidate) => candidate.sex === "male").map((candidate) => <option key={candidate.id} value={candidate.id}>{animalLabel(candidate)}</option>)}</datalist>
        <label className="field-label">Dam<input className="input" list="dam-options" name="damId" defaultValue={animal?.damId ?? ""} placeholder="Search by tag, leave blank if unknown" /></label>
        <datalist id="dam-options">{candidates.filter((candidate) => candidate.sex === "female").map((candidate) => <option key={candidate.id} value={candidate.id}>{animalLabel(candidate)}</option>)}</datalist>

        <div className="surface-muted grid gap-4 p-4 md:col-span-2 md:grid-cols-2">
          <div className="md:col-span-2"><p className="flex items-center gap-2 text-sm font-black text-field-soil"><HeartPulse size={17} className="text-field-moss" /> Goat breeding tracker</p><p className="mt-1 text-xs leading-5 text-field-soil/65">Used for female goats. These fields are cleared automatically for cattle and male animals.</p></div>
          <label className="field-label">Breeding status<select name="goatBreedingStatus" className="input" defaultValue={animal?.goatBreedingStatus ?? ""}><option value="">Not tracked</option>{breedingStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          <label className="field-label">Exposed to buck<input className="input" list="buck-options" name="exposedToBuckId" defaultValue={animal?.exposedToBuckId ?? ""} placeholder="Select buck if known" /></label>
          <datalist id="buck-options">{bucks.map((buck) => <option key={buck.id} value={buck.id}>{animalLabel(buck)}</option>)}</datalist>
          <label className="field-label">Date bred/exposed<input name="lastBredDate" type="date" className="input" defaultValue={toInputDate(animal?.lastBredDate)} /></label>
          <label className="field-label">Expected kidding<input name="expectedKiddingDate" type="date" className="input" defaultValue={toInputDate(animal?.expectedKiddingDate)} /></label>
          <label className="field-label">Pregnancy check<input name="pregnancyCheckDate" type="date" className="input" defaultValue={toInputDate(animal?.pregnancyCheckDate)} /></label>
          <label className="field-label">Breeding notes<input name="breedingNotes" className="input" defaultValue={animal?.breedingNotes ?? ""} placeholder="Heat cycle, buck exposure, delays..." /></label>
        </div>

        <label className="field-label md:col-span-2">Photo<span className="input flex items-center gap-3"><Camera size={18} className="text-field-moss" /><input name="photo" type="file" accept="image/*" className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-field-moss file:px-3 file:py-2 file:font-semibold file:text-white" /></span></label>
        <label className="field-label md:col-span-2">Notes<textarea name="notes" className="input min-h-32 resize-y" defaultValue={animal?.notes ?? ""} placeholder="Temperament, pasture history, general notes..." /></label>
      </div>
      <div className="flex justify-end border-t border-field-moss/10 bg-white/70 px-4 py-3 sm:px-5"><button className="button-primary" disabled={saving}><Save size={17} /> {saving ? "Saving..." : animal ? "Save changes" : "Add animal"}</button></div>
    </form>
  );
}
