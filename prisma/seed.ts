import { PrismaClient } from "@prisma/client";
import { PERSONAS } from "./seed-data/personas";
import { SCRIPTS } from "./seed-data/scripts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed personas
  for (const persona of PERSONAS) {
    await prisma.persona.upsert({
      where: { id: PERSONAS.indexOf(persona) + 1 },
      update: {},
      create: persona,
    });
  }
  console.log(`Seeded ${PERSONAS.length} personas`);

  // Seed scripts with sections
  for (const script of SCRIPTS) {
    const { sections, ...scriptData } = script;
    const created = await prisma.script.upsert({
      where: { id: SCRIPTS.indexOf(script) + 1 },
      update: {},
      create: {
        ...scriptData,
        sections: {
          create: sections,
        },
      },
    });
    console.log(`Seeded script: ${created.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
