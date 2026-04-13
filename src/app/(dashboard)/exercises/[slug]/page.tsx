import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import { MuscleMap } from "@/components/exercises/MuscleMap";
import {
  EQUIPMENT_LABELS,
  LEVEL_COLORS,
  LEVEL_LABELS,
  MUSCLE_LABELS,
} from "@/lib/muscle-labels";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { slug },
    include: { muscles: true },
  });

  if (!exercise) notFound();

  const primary = exercise.muscles.filter((m) => m.isPrimary).map((m) => m.muscle);
  const secondary = exercise.muscles.filter((m) => !m.isPrimary).map((m) => m.muscle);
  const instructions = exercise.instructions?.split(/\n\n+/).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/exercises"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ChevronLeft size={16} /> Bibliothèque
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-white/5 bg-background-card">
          {exercise.imageUrl ? (
            <Image
              src={exercise.imageUrl}
              alt={exercise.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">
              Pas d&apos;image disponible
            </div>
          )}
        </div>

        {/* Header + muscles */}
        <div>
          <h1 className="text-3xl font-bold leading-tight">{exercise.name}</h1>
          {exercise.nameEn && exercise.nameEn !== exercise.name && (
            <p className="mt-1 text-sm text-text-muted">{exercise.nameEn}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {primary.map((m) => (
              <span
                key={m}
                className="rounded-full bg-accent-primary/15 px-3 py-1 text-xs font-medium text-accent-primary"
              >
                {MUSCLE_LABELS[m]}
              </span>
            ))}
            {secondary.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted"
              >
                {MUSCLE_LABELS[m]}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <p className="text-[11px] uppercase text-text-muted">Équipement</p>
              <p className="font-mono">{EQUIPMENT_LABELS[exercise.equipment]}</p>
            </div>
            {exercise.difficulty && (
              <div>
                <p className="text-[11px] uppercase text-text-muted">Niveau</p>
                <p className={`font-mono ${LEVEL_COLORS[exercise.difficulty]}`}>
                  {LEVEL_LABELS[exercise.difficulty]}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-[12px] border border-white/5 bg-background-card p-4">
            <MuscleMap highlightPrimary={primary} highlightSecondary={secondary} size="md" />
          </div>
        </div>
      </div>

      {instructions.length > 0 && (
        <section className="mt-8 rounded-[12px] border border-white/5 bg-background-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Instructions</h2>
          <ol className="space-y-3">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary/15 font-mono text-xs text-accent-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {exercise.tips && (
        <section className="mt-6 rounded-[12px] border border-white/5 bg-background-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Conseils</h2>
          <p className="whitespace-pre-line text-sm text-text-muted">{exercise.tips}</p>
        </section>
      )}
    </div>
  );
}
