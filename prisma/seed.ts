import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { fetchFreeDb } from "./seed-helpers/free-db";
import { translateNamesFR } from "./seed-helpers/translate";
import { seedTemplates } from "./seed-helpers/templates";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed LifTrack\n");

  // ÉTAPE 1 : Fetch free-exercise-db
  console.log("📥 Téléchargement free-exercise-db...");
  const exercises = await fetchFreeDb();
  console.log(`  ✓ ${exercises.length} exercices parsés\n`);

  // ÉTAPE 2 : Insertion des exercices (idempotent par slug)
  console.log("💾 Insertion en base...");
  let inserted = 0;
  let skipped = 0;
  for (const ex of exercises) {
    const existing = await prisma.exercise.findUnique({ where: { slug: ex.slug } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.exercise.create({
      data: {
        name: ex.name,
        nameEn: ex.nameEn,
        slug: ex.slug,
        description: ex.description,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        instructions: ex.instructions,
        imageUrl: ex.imageUrl,
        externalId: ex.externalId,
        source: ex.source,
        isGlobal: true,
        muscles: {
          create: ex.muscles.map((m) => ({
            muscle: m.muscle,
            isPrimary: m.isPrimary,
          })),
        },
      },
    });
    inserted++;
  }
  console.log(`  ✓ ${inserted} insérés, ${skipped} déjà présents\n`);

  // ÉTAPE 3 : Traduction FR des noms (si OPENAI_API_KEY)
  console.log("🌐 Traduction FR des noms (OpenAI batch)...");
  const allExercises = await prisma.exercise.findMany({
    select: { id: true, name: true, nameEn: true },
  });
  const targets = allExercises.filter((e) => e.nameEn && e.name === e.nameEn);
  const names = [...new Set(targets.map((e) => e.nameEn!).filter(Boolean))];

  if (names.length > 0 && process.env.OPENAI_API_KEY) {
    const translations = await translateNamesFR(names);
    let updated = 0;
    for (const ex of targets) {
      if (!ex.nameEn) continue;
      const fr = translations[ex.nameEn];
      if (fr && fr !== ex.nameEn) {
        await prisma.exercise.update({
          where: { id: ex.id },
          data: { name: fr },
        });
        updated++;
      }
    }
    console.log(`  ✓ ${updated} noms mis à jour en FR\n`);
  } else if (!process.env.OPENAI_API_KEY) {
    console.log("  (skipped — pas de OPENAI_API_KEY)\n");
  } else {
    console.log("  (rien à traduire)\n");
  }

  // ÉTAPE 4 : Templates de programmes
  console.log("📋 Templates de programmes...");
  const tplCreated = await seedTemplates(prisma);
  console.log(`  ✓ ${tplCreated} templates créés\n`);

  console.log("✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
