import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "@/lib/auth/get-user";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const program = await prisma.program.findFirst({
    where: {
      id,
      OR: [{ userId: user.id }, { isTemplate: true }],
    },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: { exercise: true },
          },
        },
      },
    },
  });

  if (!program) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/programs"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ChevronLeft size={16} /> Programmes
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{program.name}</h1>
          {program.isActive && (
            <span className="rounded-full bg-accent-primary/15 px-2 py-1 text-xs text-accent-primary">
              Actif
            </span>
          )}
          {program.isTemplate && (
            <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-text-muted">
              Template
            </span>
          )}
        </div>
        {program.description && <p className="mt-2 text-text-muted">{program.description}</p>}
      </header>

      <div className="space-y-4">
        {program.days.map((day) => (
          <section key={day.id} className="rounded-[12px] border border-white/5 bg-background-card p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">{day.name}</h2>
              {day.dayOfWeek && (
                <span className="font-mono text-xs text-text-muted">{DAYS[day.dayOfWeek - 1]}</span>
              )}
            </div>

            <div className="space-y-2">
              {day.exercises.map((pe) => (
                <div
                  key={pe.id}
                  className="flex items-center gap-4 rounded-[8px] border border-white/5 bg-background-hover px-3 py-2.5"
                >
                  <Link
                    href={`/exercises/${pe.exercise.slug}`}
                    className="flex-1 truncate text-sm hover:text-accent-secondary"
                  >
                    {pe.exercise.name}
                  </Link>
                  <span className="font-mono text-xs text-text-muted">
                    {pe.targetSets} × {pe.targetReps}
                  </span>
                  {pe.restSeconds && (
                    <span className="font-mono text-xs text-text-muted">{pe.restSeconds}s</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
