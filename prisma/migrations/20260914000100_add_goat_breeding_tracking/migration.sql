CREATE TYPE "GoatBreedingStatus" AS ENUM ('open', 'exposed', 'pregnant', 'delayed', 'kidded', 'resting');

ALTER TABLE "Animal" ADD COLUMN "goatBreedingStatus" "GoatBreedingStatus";
ALTER TABLE "Animal" ADD COLUMN "lastBredDate" TIMESTAMP(3);
ALTER TABLE "Animal" ADD COLUMN "exposedToBuckId" TEXT;
ALTER TABLE "Animal" ADD COLUMN "expectedKiddingDate" TIMESTAMP(3);
ALTER TABLE "Animal" ADD COLUMN "pregnancyCheckDate" TIMESTAMP(3);
ALTER TABLE "Animal" ADD COLUMN "breedingNotes" TEXT;

CREATE INDEX "Animal_exposedToBuckId_idx" ON "Animal"("exposedToBuckId");
CREATE INDEX "Animal_goatBreedingStatus_idx" ON "Animal"("goatBreedingStatus");
CREATE INDEX "Animal_expectedKiddingDate_idx" ON "Animal"("expectedKiddingDate");

ALTER TABLE "Animal" ADD CONSTRAINT "Animal_exposedToBuckId_fkey" FOREIGN KEY ("exposedToBuckId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
