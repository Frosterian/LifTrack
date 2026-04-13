import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { ExerciseFilters } from "@/components/exercises/ExerciseFilters";
import type { Prisma, MuscleGroup, Equipment, Level } from "@prisma/client";

const PAGE_SIZE = 36;

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    muscle?: string;
    equipment?: string;
    level?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.ExerciseWhereInput = { isGlobal: true };
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { nameEn: { contains: sp.q, mode: "insensitive" } },
    ];
  }
  if (sp.equipment) where.equipment = sp.equipment as Equipment;
  if (sp.level) where.difficulty = sp.level as Level;
  if (sp.muscle) {
    where.muscles = { some: { muscle: sp.muscle as MuscleGroup } };
  }

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      include: { muscles: true },
      orderBy: { name: "asc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.exercise.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const baseQuery = new URLSearchParams();
  if (sp.q) baseQuery.set("q", sp.q);
  if (sp.muscle) baseQuery.set("muscle", sp.muscle);
  if (sp.equipment) baseQuery.set("equipment", sp.equipment);
  if (sp.level) baseQuery.set("level", sp.level);

  function pageHref(p: number) {
    const q = new URLSearchParams(baseQuery);
    q.set("page", String(p));
    return `/exercises?${q.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Bibliothèque</h1>
        <p className="font-mono text-sm text-text-muted">{total} exercices</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-6 md:h-fit">
          <ExerciseFilters />
        </aside>

        <div>
          {exercises.length === 0 ? (
            <div className="rounded-[12px] border border-white/5 bg-background-card p-12 text-center text-text-muted">
              Aucun exercice ne correspond à ces filtres.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {exercises.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={pageHref(page - 1)}
                      className="rounded-[8px] border border-white/10 bg-background-card px-4 py-2 text-sm hover:border-accent-primary/40"
                    >
                      ← Précédent
                    </Link>
                  )}
                  <span className="px-4 font-mono text-sm text-text-muted">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={pageHref(page + 1)}
                      className="rounded-[8px] border border-white/10 bg-background-card px-4 py-2 text-sm hover:border-accent-primary/40"
                    >
                      Suivant →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
