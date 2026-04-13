import { PrismaClient, type ProgramType, type Level } from "@prisma/client";

interface TplEx {
  match: string[];
  sets: number;
  reps: string;
  rest?: number;
}

interface TplDay {
  name: string;
  dayOfWeek?: number;
  exercises: TplEx[];
}

interface Template {
  name: string;
  description: string;
  type: ProgramType;
  level: Level;
  daysPerWeek: number;
  durationWeeks: number;
  days: TplDay[];
}

const TEMPLATES: Template[] = [
  {
    name: "Push / Pull / Legs (6 jours)",
    description: "Split classique 6 jours, idéal intermédiaire-avancé.",
    type: "PPL",
    level: "INTERMEDIATE",
    daysPerWeek: 6,
    durationWeeks: 8,
    days: [
      {
        name: "Push A",
        dayOfWeek: 1,
        exercises: [
          { match: ["bench press"], sets: 4, reps: "6-8", rest: 120 },
          { match: ["overhead press", "shoulder press"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["incline dumbbell press", "incline bench"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["lateral raise", "side lateral"], sets: 3, reps: "12-15", rest: 60 },
          { match: ["tricep pushdown", "tricep extension"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Pull A",
        dayOfWeek: 2,
        exercises: [
          { match: ["deadlift"], sets: 4, reps: "5", rest: 180 },
          { match: ["pull-up", "pullup"], sets: 4, reps: "AMRAP", rest: 120 },
          { match: ["barbell row", "bent over"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["face pull"], sets: 3, reps: "12-15", rest: 60 },
          { match: ["barbell curl"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Legs A",
        dayOfWeek: 3,
        exercises: [
          { match: ["squat", "barbell squat"], sets: 4, reps: "6-8", rest: 180 },
          { match: ["romanian deadlift"], sets: 3, reps: "8-10", rest: 120 },
          { match: ["leg press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["leg curl"], sets: 3, reps: "10-12", rest: 60 },
          { match: ["calf raise", "standing calf"], sets: 4, reps: "12-15", rest: 60 },
        ],
      },
      {
        name: "Push B",
        dayOfWeek: 4,
        exercises: [
          { match: ["overhead press", "shoulder press"], sets: 4, reps: "5-6", rest: 120 },
          { match: ["dumbbell bench press"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["dip", "dips"], sets: 3, reps: "AMRAP", rest: 90 },
          { match: ["cable lateral", "lateral raise"], sets: 4, reps: "12-15", rest: 60 },
          { match: ["skullcrusher", "lying tricep"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Pull B",
        dayOfWeek: 5,
        exercises: [
          { match: ["barbell row", "pendlay"], sets: 4, reps: "6-8", rest: 120 },
          { match: ["lat pulldown", "pulldown"], sets: 4, reps: "10-12", rest: 90 },
          { match: ["seated cable row"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["hammer curl"], sets: 3, reps: "10-12", rest: 60 },
          { match: ["face pull"], sets: 3, reps: "15", rest: 60 },
        ],
      },
      {
        name: "Legs B",
        dayOfWeek: 6,
        exercises: [
          { match: ["front squat"], sets: 4, reps: "6-8", rest: 150 },
          { match: ["romanian deadlift"], sets: 4, reps: "6-8", rest: 120 },
          { match: ["bulgarian split squat", "split squat"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["leg extension"], sets: 3, reps: "12-15", rest: 60 },
          { match: ["seated calf"], sets: 4, reps: "15", rest: 60 },
        ],
      },
    ],
  },
  {
    name: "Upper / Lower (4 jours)",
    description: "Split haut/bas équilibré, parfait pour reprendre ou progresser sereinement.",
    type: "UPPER_LOWER",
    level: "INTERMEDIATE",
    daysPerWeek: 4,
    durationWeeks: 6,
    days: [
      {
        name: "Upper A",
        dayOfWeek: 1,
        exercises: [
          { match: ["bench press"], sets: 4, reps: "6-8", rest: 120 },
          { match: ["barbell row", "bent over"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["overhead press"], sets: 3, reps: "8-10", rest: 90 },
          { match: ["pull-up", "pullup"], sets: 3, reps: "AMRAP", rest: 90 },
          { match: ["barbell curl"], sets: 3, reps: "10-12", rest: 60 },
          { match: ["tricep pushdown"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Lower A",
        dayOfWeek: 2,
        exercises: [
          { match: ["squat", "barbell squat"], sets: 4, reps: "6-8", rest: 180 },
          { match: ["romanian deadlift"], sets: 3, reps: "8-10", rest: 120 },
          { match: ["leg press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["leg curl"], sets: 3, reps: "10-12", rest: 60 },
          { match: ["calf raise"], sets: 4, reps: "15", rest: 60 },
        ],
      },
      {
        name: "Upper B",
        dayOfWeek: 4,
        exercises: [
          { match: ["incline dumbbell press"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["lat pulldown"], sets: 4, reps: "8-10", rest: 90 },
          { match: ["dumbbell shoulder press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["seated cable row"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["hammer curl"], sets: 3, reps: "10-12", rest: 60 },
          { match: ["skullcrusher"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Lower B",
        dayOfWeek: 5,
        exercises: [
          { match: ["deadlift"], sets: 4, reps: "5", rest: 180 },
          { match: ["front squat"], sets: 3, reps: "8-10", rest: 120 },
          { match: ["bulgarian split squat"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["leg extension"], sets: 3, reps: "12-15", rest: 60 },
          { match: ["seated calf"], sets: 4, reps: "15", rest: 60 },
        ],
      },
    ],
  },
  {
    name: "Full Body (3 jours)",
    description: "Programme corps complet 3x/semaine, idéal débutant.",
    type: "FULL_BODY",
    level: "BEGINNER",
    daysPerWeek: 3,
    durationWeeks: 8,
    days: [
      {
        name: "Full Body A",
        dayOfWeek: 1,
        exercises: [
          { match: ["squat", "barbell squat"], sets: 3, reps: "8-10", rest: 120 },
          { match: ["bench press"], sets: 3, reps: "8-10", rest: 120 },
          { match: ["barbell row", "bent over"], sets: 3, reps: "8-10", rest: 90 },
          { match: ["overhead press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["plank"], sets: 3, reps: "30-60s", rest: 60 },
        ],
      },
      {
        name: "Full Body B",
        dayOfWeek: 3,
        exercises: [
          { match: ["deadlift"], sets: 3, reps: "5-6", rest: 180 },
          { match: ["incline dumbbell press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["pull-up", "pullup", "lat pulldown"], sets: 3, reps: "AMRAP", rest: 90 },
          { match: ["dumbbell shoulder press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["barbell curl"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
      {
        name: "Full Body C",
        dayOfWeek: 5,
        exercises: [
          { match: ["front squat", "leg press"], sets: 3, reps: "10-12", rest: 120 },
          { match: ["dumbbell bench press"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["seated cable row"], sets: 3, reps: "10-12", rest: 90 },
          { match: ["lateral raise"], sets: 3, reps: "12-15", rest: 60 },
          { match: ["tricep pushdown"], sets: 3, reps: "10-12", rest: 60 },
        ],
      },
    ],
  },
];

export async function seedTemplates(prisma: PrismaClient) {
  const allExercises = await prisma.exercise.findMany({
    select: { id: true, name: true, nameEn: true },
  });

  function findExercise(matches: string[]): string | null {
    for (const m of matches) {
      const lower = m.toLowerCase();
      const found = allExercises.find(
        (ex) =>
          ex.name.toLowerCase().includes(lower) ||
          ex.nameEn?.toLowerCase().includes(lower),
      );
      if (found) return found.id;
    }
    return null;
  }

  let created = 0;
  for (const tpl of TEMPLATES) {
    const exists = await prisma.program.findFirst({
      where: { name: tpl.name, isTemplate: true },
    });
    if (exists) continue;

    const program = await prisma.program.create({
      data: {
        name: tpl.name,
        description: tpl.description,
        type: tpl.type,
        level: tpl.level,
        daysPerWeek: tpl.daysPerWeek,
        durationWeeks: tpl.durationWeeks,
        isTemplate: true,
        isActive: false,
      },
    });

    for (let i = 0; i < tpl.days.length; i++) {
      const day = tpl.days[i];
      const programDay = await prisma.programDay.create({
        data: {
          programId: program.id,
          name: day.name,
          dayOfWeek: day.dayOfWeek,
          order: i,
        },
      });

      let order = 0;
      for (const ex of day.exercises) {
        const exId = findExercise(ex.match);
        if (!exId) {
          console.log(`  ⚠️  no match for: ${ex.match.join(" | ")}`);
          continue;
        }
        await prisma.programExercise.create({
          data: {
            programDayId: programDay.id,
            exerciseId: exId,
            order: order++,
            targetSets: ex.sets,
            targetReps: ex.reps,
            restSeconds: ex.rest,
          },
        });
      }
    }
    created++;
  }
  return created;
}
