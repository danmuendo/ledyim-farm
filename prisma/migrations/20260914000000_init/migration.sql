-- CreateEnum
CREATE TYPE "Species" AS ENUM ('cattle', 'goat');
CREATE TYPE "Sex" AS ENUM ('male', 'female');
CREATE TYPE "AnimalStatus" AS ENUM ('active', 'sold', 'deceased');
CREATE TYPE "TreatmentType" AS ENUM ('vaccination', 'deworming', 'illness', 'injury', 'checkup', 'other');

-- CreateTable
CREATE TABLE "Animal" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "tagCode" TEXT NOT NULL,
  "species" "Species" NOT NULL,
  "sex" "Sex" NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "photoUrl" TEXT,
  "sireId" TEXT,
  "damId" TEXT,
  "status" "AnimalStatus" NOT NULL DEFAULT 'active',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TreatmentRecord" (
  "id" TEXT NOT NULL,
  "animalId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "type" "TreatmentType" NOT NULL,
  "description" TEXT NOT NULL,
  "medicineUsed" TEXT,
  "dosage" TEXT,
  "administeredBy" TEXT,
  "nextDueDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TreatmentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BirthRecord" (
  "id" TEXT NOT NULL,
  "damId" TEXT NOT NULL,
  "sireId" TEXT,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BirthRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BirthRecordOffspring" (
  "birthRecordId" TEXT NOT NULL,
  "animalId" TEXT NOT NULL,
  CONSTRAINT "BirthRecordOffspring_pkey" PRIMARY KEY ("birthRecordId", "animalId")
);

CREATE UNIQUE INDEX "Animal_tagCode_key" ON "Animal"("tagCode");
CREATE INDEX "Animal_species_idx" ON "Animal"("species");
CREATE INDEX "Animal_sireId_idx" ON "Animal"("sireId");
CREATE INDEX "Animal_damId_idx" ON "Animal"("damId");
CREATE INDEX "Animal_status_idx" ON "Animal"("status");
CREATE INDEX "TreatmentRecord_animalId_idx" ON "TreatmentRecord"("animalId");
CREATE INDEX "TreatmentRecord_nextDueDate_idx" ON "TreatmentRecord"("nextDueDate");
CREATE INDEX "BirthRecord_damId_idx" ON "BirthRecord"("damId");
CREATE INDEX "BirthRecord_sireId_idx" ON "BirthRecord"("sireId");
CREATE INDEX "BirthRecord_birthDate_idx" ON "BirthRecord"("birthDate");
CREATE INDEX "BirthRecordOffspring_animalId_idx" ON "BirthRecordOffspring"("animalId");

ALTER TABLE "Animal" ADD CONSTRAINT "Animal_sireId_fkey" FOREIGN KEY ("sireId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_damId_fkey" FOREIGN KEY ("damId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TreatmentRecord" ADD CONSTRAINT "TreatmentRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_damId_fkey" FOREIGN KEY ("damId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_sireId_fkey" FOREIGN KEY ("sireId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BirthRecordOffspring" ADD CONSTRAINT "BirthRecordOffspring_birthRecordId_fkey" FOREIGN KEY ("birthRecordId") REFERENCES "BirthRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BirthRecordOffspring" ADD CONSTRAINT "BirthRecordOffspring_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
