import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.birthRecordOffspring.deleteMany();
  await prisma.birthRecord.deleteMany();
  await prisma.treatmentRecord.deleteMany();
  await prisma.animal.deleteMany();

  const bull = await prisma.animal.create({
    data: {
      name: "Mosi",
      tagCode: "C-001",
      species: "cattle",
      sex: "male",
      dateOfBirth: new Date("2018-02-12"),
      status: "active",
      notes: "Calm breeding bull."
    }
  });

  const cow = await prisma.animal.create({
    data: {
      name: "Nala",
      tagCode: "C-002",
      species: "cattle",
      sex: "female",
      dateOfBirth: new Date("2019-07-04"),
      status: "active",
      notes: "Good milk producer."
    }
  });

  const grandSire = await prisma.animal.create({
    data: {
      name: "Kito",
      tagCode: "C-000",
      species: "cattle",
      sex: "male",
      dateOfBirth: new Date("2015-05-20"),
      status: "sold"
    }
  });

  const calf = await prisma.animal.create({
    data: {
      name: "Asha",
      tagCode: "C-014",
      species: "cattle",
      sex: "female",
      dateOfBirth: new Date("2023-10-18"),
      sireId: bull.id,
      damId: cow.id,
      status: "active",
      notes: "Seed calf with both parents linked."
    }
  });

  await prisma.animal.update({ where: { id: bull.id }, data: { sireId: grandSire.id } });

  const buck = await prisma.animal.create({
    data: {
      name: "Beka",
      tagCode: "G-001",
      species: "goat",
      sex: "male",
      dateOfBirth: new Date("2021-03-11"),
      status: "active"
    }
  });

  const doe = await prisma.animal.create({
    data: {
      name: "Malaika",
      tagCode: "G-002",
      species: "goat",
      sex: "female",
      dateOfBirth: new Date("2022-01-28"),
      status: "active"
    }
  });

  const kid = await prisma.animal.create({
    data: {
      name: "Pili",
      tagCode: "G-006",
      species: "goat",
      sex: "female",
      dateOfBirth: new Date("2024-06-02"),
      sireId: buck.id,
      damId: doe.id,
      status: "active"
    }
  });

  await prisma.birthRecord.create({
    data: {
      damId: cow.id,
      sireId: bull.id,
      birthDate: new Date("2023-10-18"),
      notes: "Single healthy heifer calf.",
      offspring: { create: [{ animalId: calf.id }] }
    }
  });

  await prisma.birthRecord.create({
    data: {
      damId: doe.id,
      sireId: buck.id,
      birthDate: new Date("2024-06-02"),
      notes: "Goat kidding record.",
      offspring: { create: [{ animalId: kid.id }] }
    }
  });

  await prisma.treatmentRecord.createMany({
    data: [
      {
        animalId: calf.id,
        date: new Date("2026-08-15"),
        type: "vaccination",
        description: "Annual clostridial vaccine.",
        medicineUsed: "Covexin",
        dosage: "2 ml",
        administeredBy: "Farm owner",
        nextDueDate: new Date("2026-10-15")
      },
      {
        animalId: kid.id,
        date: new Date("2026-08-30"),
        type: "deworming",
        description: "Routine deworming after pasture rotation.",
        medicineUsed: "Albendazole",
        dosage: "Oral by weight",
        administeredBy: "Farm owner",
        nextDueDate: new Date("2026-11-30")
      }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
