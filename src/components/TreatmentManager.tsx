"use client";

import { FormEvent, useState } from "react";
import { CalendarClock, Pencil, Plus, Trash2, X } from "lucide-react";
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
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-2"><p className="eyebrow">Health log</p><h2 className="section-title">Treatments</h2><p className="text-sm leading-6 text-stone-600">Keep vaccinations, deworming, illness notes, and next due dates close to the animal record.</p></div>
      <form onSubmit={save} className="surface overflow-hidden">
        <div className="border-b border-field-moss/10 bg-field-mist/50 px-4 py-3"><p className="text-sm font-bold text-field-soil">{editingId ? "Edit treatment" : "Add treatment"}</p></div>
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 md:col-span-2">{error}</p>}
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="vaccination">Vaccination</option><option value="deworming">Deworming</option><option value="illness">Illness</option><option value="injury">Injury</option><option value="checkup">Checkup</option><option value="other">Other</option></select>
          <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="input" placeholder="Medicine used" value={form.medicineUsed} onChange={(e) => setForm({ ...form, medicineUsed: e.target.value })} />
          <input className="input" placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
          <input className="input" placeholder="Administered by" value={form.administeredBy} onChange={(e) => setForm({ ...form, administeredBy: e.target.value })} />
          <input className="input" type="date" value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
        </div>
        <div className="flex gap-2 border-t border-field-moss/10 bg-white/70 px-4 py-3"><button className="button-primary"><Plus size={17} /> {editingId ? "Update" : "Add treatment"}</button>{editingId && <button type="button" className="button-secondary" onClick={() => { setEditingId(null); setForm(empty); }}><X size={16} /> Cancel</button>}</div>
      </form>
      <div className="space-y-3 lg:col-span-2">
        {treatments.map((treatment) => (
          <article key={treatment.id} className="surface p-4 transition hover:shadow-lift">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3"><span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-md bg-field-mist text-field-moss"><CalendarClock size={18} /></span><div><p className="font-black capitalize text-field-soil">{treatment.type}</p><p className="text-sm font-semibold text-field-moss">{formatDate(treatment.date)}</p><p className="mt-1 text-sm text-stone-700">{treatment.description}</p></div></div>
              <div className="flex gap-2"><button className="button-secondary" onClick={() => edit(treatment)}><Pencil size={15} /> Edit</button><button className="button-danger" onClick={() => remove(treatment.id)}><Trash2 size={15} /> Delete</button></div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-4"><div className="surface-muted px-3 py-2">Medicine<br /><b className="text-field-soil">{treatment.medicineUsed || "-"}</b></div><div className="surface-muted px-3 py-2">Dosage<br /><b className="text-field-soil">{treatment.dosage || "-"}</b></div><div className="surface-muted px-3 py-2">By<br /><b className="text-field-soil">{treatment.administeredBy || "-"}</b></div><div className="surface-muted px-3 py-2">Next due<br /><b className="text-field-soil">{formatDate(treatment.nextDueDate)}</b></div></dl>
          </article>
        ))}
        {treatments.length === 0 && <p className="surface border-dashed p-6 text-center text-stone-600">No treatments recorded yet.</p>}
      </div>
    </section>
  );
}
