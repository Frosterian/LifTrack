import type { MuscleGroup, Equipment, Level } from "@prisma/client";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mapMuscle(raw: string): MuscleGroup | null {
  const m = raw.toLowerCase().trim();
  const map: Record<string, MuscleGroup> = {
    abdominals: "ABS",
    abs: "ABS",
    biceps: "BICEPS",
    calves: "CALVES",
    chest: "CHEST",
    forearms: "FOREARMS",
    glutes: "GLUTES",
    hamstrings: "HAMSTRINGS",
    lats: "LATS",
    "lower back": "BACK",
    "middle back": "BACK",
    back: "BACK",
    neck: "TRAPS",
    quadriceps: "QUADRICEPS",
    quads: "QUADRICEPS",
    shoulders: "SHOULDERS",
    traps: "TRAPS",
    triceps: "TRICEPS",
    abductors: "GLUTES",
    adductors: "QUADRICEPS",
  };
  return map[m] ?? null;
}

export function mapEquipment(raw: string | null | undefined): Equipment {
  if (!raw) return "OTHER";
  const e = raw.toLowerCase().trim();
  const map: Record<string, Equipment> = {
    "body only": "BODYWEIGHT",
    bodyweight: "BODYWEIGHT",
    machine: "MACHINE",
    kettlebells: "KETTLEBELL",
    kettlebell: "KETTLEBELL",
    dumbbell: "DUMBBELL",
    dumbbells: "DUMBBELL",
    cable: "CABLE",
    barbell: "BARBELL",
    "e-z curl bar": "BARBELL",
    bands: "BAND",
    band: "BAND",
    "medicine ball": "OTHER",
    "exercise ball": "OTHER",
    "foam roll": "OTHER",
    other: "OTHER",
  };
  return map[e] ?? "OTHER";
}

export function mapLevel(raw: string | null | undefined): Level | null {
  if (!raw) return null;
  const l = raw.toLowerCase().trim();
  if (l === "beginner") return "BEGINNER";
  if (l === "intermediate") return "INTERMEDIATE";
  if (l === "expert" || l === "advanced") return "ADVANCED";
  return null;
}
