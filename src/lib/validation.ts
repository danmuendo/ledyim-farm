import { z } from "zod";

export const animalSchema = z.object({
  name: z.string().trim().optional().transform((value) => value || null),
  tagCode: z.string().trim().min(1, "Tag code is required").max(32),
  species: z.enum(["cattle", "goat"]),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.coerce.date(),
  photoUrl: z.string().trim().optional().transform((value) => value || null),
  sireId: z.string().trim().optional().transform((value) => value || null),
  damId: z.string().trim().optional().transform((value) => value || null),
  status: z.enum(["active", "sold", "deceased"]).default("active"),
  notes: z.string().trim().optional().transform((value) => value || null)
});

export const treatmentSchema = z.object({
  date: z.coerce.date(),
  type: z.enum(["vaccination", "deworming", "illness", "injury", "checkup", "other"]),
  description: z.string().trim().min(1, "Description is required"),
  medicineUsed: z.string().trim().optional().transform((value) => value || null),
  dosage: z.string().trim().optional().transform((value) => value || null),
  administeredBy: z.string().trim().optional().transform((value) => value || null),
  nextDueDate: z.string().trim().optional().transform((value) => value ? new Date(value) : null)
});

export const birthRecordSchema = z.object({
  damId: z.string().trim().min(1),
  sireId: z.string().trim().optional().transform((value) => value || null),
  birthDate: z.coerce.date(),
  offspringIds: z.array(z.string().trim().min(1)).default([]),
  notes: z.string().trim().optional().transform((value) => value || null)
});
