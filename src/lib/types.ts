export type GoatBreedingStatus = "open" | "exposed" | "pregnant" | "delayed" | "kidded" | "resting";

export type AnimalOption = {
  id: string;
  name: string | null;
  tagCode: string;
  species: "cattle" | "goat";
  sex: "male" | "female";
  dateOfBirth: string | Date;
  photoUrl?: string | null;
  status?: "active" | "sold" | "deceased";
  goatBreedingStatus?: GoatBreedingStatus | null;
  lastBredDate?: string | Date | null;
  exposedToBuckId?: string | null;
  expectedKiddingDate?: string | Date | null;
  pregnancyCheckDate?: string | Date | null;
  breedingNotes?: string | null;
};

export type Treatment = {
  id: string;
  date: string | Date;
  type: "vaccination" | "deworming" | "illness" | "injury" | "checkup" | "other";
  description: string;
  medicineUsed: string | null;
  dosage: string | null;
  administeredBy: string | null;
  nextDueDate: string | Date | null;
};

export type PedigreeAnimal = AnimalOption & {
  sire?: PedigreeAnimal | null;
  dam?: PedigreeAnimal | null;
};
