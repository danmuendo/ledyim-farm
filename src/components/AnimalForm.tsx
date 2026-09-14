"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AnimalOption } from "@/lib/types";
import { animalLabel } from "@/lib/format";

type AnimalFormValues = AnimalOption & {
  notes?: string | null;
  sireId?: string | null;
  damId?: string | null;
};

function toInputDate(value: string | Date | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function AnimalForm({ animal, animals }: { animal?: AnimalFormValues; animals: AnimalOption[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const candidates = animals.filter((candidate) => candidate.id !== animal?.id);

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
    <form onSubmit={onSubmit} className="grid gap-4 rounded-md border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-2">
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
      <label className="field-label">Name<input name="name" className="input" defaultValue={animal?.name ?? ""} placeholder="Optional" /></label>
      <label className="field-label">Tag code<input name="tagCode" className="input" defaultValue={animal?.tagCode ?? ""} required maxLength={32} /></label>
      <label className="field-label">Species<select name="species" className="input" defaultValue={animal?.species ?? "cattle"}><option value="cattle">Cattle</option><option value="goat">Goat</option></select></label>
      <label className="field-label">Sex<select name="sex" className="input" defaultValue={animal?.sex ?? "female"}><option value="female">Female</option><option value="male">Male</option></select></label>
      <label className="field-label">Date of birth<input name="dateOfBirth" type="date" className="input" defaultValue={toInputDate(animal?.dateOfBirth)} required /></label>
      <label className="field-label">Status<select name="status" className="input" defaultValue={animal?.status ?? "active"}><option value="active">Active</option><option value="sold">Sold</option><option value="deceased">Deceased</option></select></label>
      <label className="field-label">Sire<input className="input" list="sire-options" name="sireId" defaultValue={animal?.sireId ?? ""} placeholder="Search by tag, leave blank if unknown" /></label>
      <datalist id="sire-options">{candidates.filter((candidate) => candidate.sex === "male").map((candidate) => <option key={candidate.id} value={candidate.id}>{animalLabel(candidate)}</option>)}</datalist>
      <label className="field-label">Dam<input className="input" list="dam-options" name="damId" defaultValue={animal?.damId ?? ""} placeholder="Search by tag, leave blank if unknown" /></label>
      <datalist id="dam-options">{candidates.filter((candidate) => candidate.sex === "female").map((candidate) => <option key={candidate.id} value={candidate.id}>{animalLabel(candidate)}</option>)}</datalist>
      <label className="field-label md:col-span-2">Photo<input name="photo" type="file" accept="image/*" className="input file:mr-3 file:rounded file:border-0 file:bg-field-moss file:px-3 file:py-2 file:text-white" /></label>
      <label className="field-label md:col-span-2">Notes<textarea name="notes" className="input min-h-28" defaultValue={animal?.notes ?? ""} /></label>
      <div className="flex gap-3 md:col-span-2">
        <button className="button-primary" disabled={saving}>{saving ? "Saving..." : animal ? "Save changes" : "Add animal"}</button>
      </div>
    </form>
  );
}
