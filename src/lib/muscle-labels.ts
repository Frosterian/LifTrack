import type { MuscleGroup, Equipment, Level } from "@prisma/client";

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  CHEST: "Pectoraux",
  BACK: "Dos",
  SHOULDERS: "Épaules",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  FOREARMS: "Avant-bras",
  QUADRICEPS: "Quadriceps",
  HAMSTRINGS: "Ischios",
  GLUTES: "Fessiers",
  CALVES: "Mollets",
  ABS: "Abdos",
  TRAPS: "Trapèzes",
  LATS: "Grand dorsal",
  FULL_BODY: "Corps entier",
  CARDIO: "Cardio",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  BARBELL: "Barre",
  DUMBBELL: "Haltères",
  MACHINE: "Machine",
  CABLE: "Poulie",
  BODYWEIGHT: "Poids du corps",
  KETTLEBELL: "Kettlebell",
  BAND: "Élastique",
  OTHER: "Autre",
};

export const LEVEL_LABELS: Record<Level, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

export const LEVEL_COLORS: Record<Level, string> = {
  BEGINNER: "text-success",
  INTERMEDIATE: "text-warning",
  ADVANCED: "text-danger",
};
