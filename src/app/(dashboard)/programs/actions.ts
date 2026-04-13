"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "@/lib/auth/get-user";

const ProgramTypeEnum = z.enum(["PPL", "UPPER_LOWER", "FULL_BODY", "BRO_SPLIT", "CUSTOM"]);
const LevelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export async function activateProgram(programId: string) {
  const user = await requireUser();
  await prisma.$transaction([
    prisma.program.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false },
    }),
    prisma.program.update({
      where: { id: programId, userId: user.id },
      data: { isActive: true },
    }),
  ]);
  revalidatePath("/programs");
  revalidatePath("/dashboard");
}

export async function deactivateProgram(programId: string) {
  const user = await requireUser();
  await prisma.program.update({
    where: { id: programId, userId: user.id },
    data: { isActive: false },
  });
  revalidatePath("/programs");
  revalidatePath("/dashboard");
}

export async function deleteProgram(programId: string) {
  const user = await requireUser();
  await prisma.program.delete({
    where: { id: programId, userId: user.id },
  });
  revalidatePath("/programs");
}

export async function duplicateTemplate(templateId: string) {
  const user = await requireUser();
  const tpl = await prisma.program.findFirst({
    where: { id: templateId, isTemplate: true },
    include: { days: { include: { exercises: true } } },
  });
  if (!tpl) throw new Error("Template introuvable");

  const created = await prisma.program.create({
    data: {
      name: tpl.name,
      description: tpl.description,
      type: tpl.type,
      durationWeeks: tpl.durationWeeks,
      daysPerWeek: tpl.daysPerWeek,
      level: tpl.level,
      isTemplate: false,
      userId: user.id,
      days: {
        create: tpl.days.map((d) => ({
          name: d.name,
          dayOfWeek: d.dayOfWeek,
          order: d.order,
          exercises: {
            create: d.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              order: e.order,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
              targetWeight: e.targetWeight,
              restSeconds: e.restSeconds,
              notes: e.notes,
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/programs");
  redirect(`/programs/${created.id}`);
}

const CreateProgramSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
  description: z.string().max(500).optional(),
  type: ProgramTypeEnum,
  level: LevelEnum.optional(),
  daysPerWeek: z.number().int().min(1).max(7),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  days: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        dayOfWeek: z.number().int().min(1).max(7).optional().nullable(),
        exercises: z.array(
          z.object({
            exerciseId: z.string().uuid(),
            targetSets: z.number().int().min(1).max(20),
            targetReps: z.string().min(1).max(20),
            restSeconds: z.number().int().min(0).max(600).optional().nullable(),
          }),
        ),
      }),
    )
    .min(1),
});

export async function createProgram(input: z.infer<typeof CreateProgramSchema>) {
  const user = await requireUser();
  const data = CreateProgramSchema.parse(input);

  const created = await prisma.program.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      level: data.level,
      daysPerWeek: data.daysPerWeek,
      durationWeeks: data.durationWeeks,
      userId: user.id,
      days: {
        create: data.days.map((d, i) => ({
          name: d.name,
          dayOfWeek: d.dayOfWeek ?? null,
          order: i,
          exercises: {
            create: d.exercises.map((e, j) => ({
              exerciseId: e.exerciseId,
              order: j,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
              restSeconds: e.restSeconds ?? null,
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/programs");
  return { id: created.id };
}
