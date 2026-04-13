import { mapEquipment, mapLevel, mapMuscle, slugify } from "./mappers";
import type { MuscleGroup, Equipment, Level } from "@prisma/client";

const FREE_DB_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

const IMG_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

interface FreeDbExercise {
  id: string;
  name: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category?: string | null;
  images: string[];
}

export interface ParsedExercise {
  externalId: string;
  source: "free-exercise-db";
  name: string;
  nameEn: string;
  slug: string;
  description: string | null;
  equipment: Equipment;
  difficulty: Level | null;
  instructions: string | null;
  imageUrl: string | null;
  muscles: { muscle: MuscleGroup; isPrimary: boolean }[];
}

export async function fetchFreeDb(): Promise<ParsedExercise[]> {
  const res = await fetch(FREE_DB_URL);
  if (!res.ok) throw new Error(`free-exercise-db fetch failed: ${res.status}`);
  const data: FreeDbExercise[] = await res.json();

  const seen = new Set<string>();
  const parsed: ParsedExercise[] = [];

  for (const ex of data) {
    const slug = slugify(ex.name);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const muscles: ParsedExercise["muscles"] = [];
    const usedMuscles = new Set<MuscleGroup>();

    for (const raw of ex.primaryMuscles ?? []) {
      const m = mapMuscle(raw);
      if (m && !usedMuscles.has(m)) {
        usedMuscles.add(m);
        muscles.push({ muscle: m, isPrimary: true });
      }
    }
    for (const raw of ex.secondaryMuscles ?? []) {
      const m = mapMuscle(raw);
      if (m && !usedMuscles.has(m)) {
        usedMuscles.add(m);
        muscles.push({ muscle: m, isPrimary: false });
      }
    }
    if (muscles.length === 0) {
      muscles.push({ muscle: "FULL_BODY", isPrimary: true });
    }

    parsed.push({
      externalId: ex.id,
      source: "free-exercise-db",
      name: ex.name,
      nameEn: ex.name,
      slug,
      description: null,
      equipment: mapEquipment(ex.equipment),
      difficulty: mapLevel(ex.level),
      instructions: ex.instructions?.join("\n\n") || null,
      imageUrl: ex.images?.[0] ? `${IMG_BASE}${ex.images[0]}` : null,
      muscles,
    });
  }

  return parsed;
}
