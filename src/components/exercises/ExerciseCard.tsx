import Link from "next/link";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import type { Exercise, ExerciseMuscle } from "@prisma/client";
import { EQUIPMENT_LABELS, MUSCLE_LABELS } from "@/lib/muscle-labels";

type ExerciseWithMuscles = Exercise & { muscles: ExerciseMuscle[] };

export function ExerciseCard({ exercise }: { exercise: ExerciseWithMuscles }) {
  const primary = exercise.muscles.find((m) => m.isPrimary);
  return (
    <Link
      href={`/exercises/${exercise.slug}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-white/5 bg-background-card transition hover:border-accent-primary/30 hover:shadow-[0_0_20px_rgba(0,245,160,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background-hover">
        {exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt={exercise.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <Dumbbell size={32} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{exercise.name}</h3>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {primary && (
            <span className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[10px] font-medium text-accent-primary">
              {MUSCLE_LABELS[primary.muscle]}
            </span>
          )}
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-text-muted">
            {EQUIPMENT_LABELS[exercise.equipment]}
          </span>
        </div>
      </div>
    </Link>
  );
}
