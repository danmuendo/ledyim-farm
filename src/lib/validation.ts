import { z } from "zod";

const optionalString = z.string().trim().optional().transform((value) => value || null);
const optionalDate = z.string().trim().optional().transform((value) => value ? new Date(value) : null);

export const animalSchema = z.object({
  name: optionalString,
  tagCode: z.string().trim().min(1, "Tag code is required").max(32),
  species: z.enum(["cattle", "goat"]),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.coerce.date(),
  photoUrl: optionalString,
  sireId: optionalString,
  damId: optionalString,
  status: z.enum(["active", "sold", "deceased"]).default("active"),
  goatBreedingStatus: z.enum(["open", "exposed", "pregnant", "delayed", "kidded", "resting"]).optional().transform((value) => value || null),
  lastBredDate: optionalDate,
  exposedToBuckId: optionalString,
  expectedKiddingDate: optionalDate,
  pregnancyCheckDate: optionalDate,
  breedingNotes: optionalString,
  notes: optionalString
});

export type AnimalInput = z.infer<typeof animalSchema>;

export function normalizeBreedingData(data: AnimalInput): AnimalInput {
  if (data.species !== "goat" || data.sex !== "female") {
    return {
      ...data,
      goatBreedingStatus: null,
      lastBredDate: null,
      exposedToBuckId: null,
      expectedKiddingDate: null,
      pregnancyCheckDate: null,
      breedingNotes: null
    };
  }

  return data;
}

export const treatmentSchema = z.object({
  date: z.coerce.date(),
  type: z.enum(["vaccination", "deworming", "illness", "injury", "checkup", "other"]),
  description: z.string().trim().min(1, "Description is required"),
  medicineUsed: optionalString,
  dosage: optionalString,
  administeredBy: optionalString,
  nextDueDate: optionalDate
});

export const birthRecordSchema = z.object({
  damId: z.string().trim().min(1),
  sireId: optionalString,
  birthDate: z.coerce.date(),
  offspringIds: z.array(z.string().trim().min(1)).default([]),
  notes: optionalString
});
