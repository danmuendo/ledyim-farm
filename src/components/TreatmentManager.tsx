"use client";

import { FormEvent, useState } from "react";
import { formatDate } from "@/lib/format";
import { Treatment } from "@/lib/types";

const empty = { date: new Date().toISOString().slice(0, 10), type: "checkup", description: "", medicineUsed: "", dosage: "", administeredBy: "", nextDueDate: "" };

export function TreatmentManager({ animalId, initialTreatments }: { animalId: string; initialTreatments: Treatment[] }) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch(editingId ? `/api/treatments/${editingId}` : `/api/animals/${animalId}/treatments`, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save treatment.");
      return;
    }
    setTreatments((current) => [payload, ...current.filter((item) => item.id !== payload.id)].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setForm(empty);
    setEditingId(null);
  }

  async function remove(id: string) {
    await fetch(`/api/treatments/${id}`, { method: "DELETE" });
    setTreatments((current) => current.filter((item) => item.id !== id));
  }

  function edit(treatment: Treatment) {
    setEditingId(treatment.id);
    setForm({
      date: new Date(treatment.date).toISOString().slice(0, 10),
      type: treatment.type,
      description: treatment.description,
      medicineUsed: treatment.medicineUsed ?? "",
      dosage: treatment.dosage ?? "",
      administeredBy: treatment.administeredBy ?? "",
      nextDueDate: treatment.nextDueDate ? new Date(treatment.nextDueDate).toISOString().slice(0, 10) : ""
    });
  }

  return (
    <section className="space-y-4">
      <h2 className="section-title">Treatments</h2>
      <form onSubmit={save} className="grid gap-3 rounded-md border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-2">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="vaccination">Vaccination</option><option value="deworming">Deworming</option><option value="illness">Illness</option><option value="injury">Injury</option><option value="checkup">Checkup</option><option value="other">Other</option>
        </select>
        <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="input" placeholder="Medicine used" value={form.medicineUsed} onChange={(e) => setForm({ ...form, medicineUsed: e.target.value })} />
        <input className="input" placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
        <input className="input" placeholder="Administered by" value={form.administeredBy} onChange={(e) => setForm({ ...form, administeredBy: e.target.value })} />
        <input className="input" type="date" value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
        <div className="flex gap-2 md:col-span-2"><button className="button-primary">{editingId ? "Update treatment" : "Add treatment"}</button>{editingId && <button type="button" className="button-secondary" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}</div>
      </form>
      <div className="space-y-3">
        {treatments.map((treatment) => (
          <article key={treatment.id} className="rounded-md border border-stone-200 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-semibold capitalize text-field-ink">{treatment.type} - {formatDate(treatment.date)}</p><p className="text-sm text-stone-700">{treatment.description}</p></div>
              <div className="flex gap-2"><button className="button-secondary" onClick={() => edit(treatment)}>Edit</button><button className="button-danger" onClick={() => remove(treatment.id)}>Delete</button></div>
            </div>
            <dl className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2"><div>Medicine: {treatment.medicineUsed || "-"}</div><div>Dosage: {treatment.dosage || "-"}</div><div>By: {treatment.administeredBy || "-"}</div><div>Next due: {formatDate(treatment.nextDueDate)}</div></dl>
          </article>
        ))}
        {treatments.length === 0 && <p className="rounded-md border border-dashed border-stone-300 p-6 text-center text-stone-600">No treatments recorded yet.</p>}
      </div>
    </section>
  );
}
