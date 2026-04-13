"use client";

import Link from "next/link";
import { useTransition } from "react";
import { CheckCircle2, Calendar, Trash2 } from "lucide-react";
import type { Program } from "@prisma/client";
import { activateProgram, deactivateProgram, deleteProgram, duplicateTemplate } from "@/app/(dashboard)/programs/actions";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  PPL: "Push/Pull/Legs",
  UPPER_LOWER: "Upper / Lower",
  FULL_BODY: "Full Body",
  BRO_SPLIT: "Bro Split",
  CUSTOM: "Personnalisé",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

interface ProgramCardProps {
  program: Program;
  isTemplate?: boolean;
}

export function ProgramCard({ program, isTemplate = false }: ProgramCardProps) {
  const [pending, start] = useTransition();

  return (
    <div
      className={cn(
        "rounded-[12px] border bg-background-card p-5 transition",
        program.isActive
          ? "border-accent-primary/40 shadow-[0_0_20px_rgba(0,245,160,0.1)]"
          : "border-white/5 hover:border-white/15",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/programs/${program.id}`}
            className="block truncate font-semibold hover:text-accent-secondary"
          >
            {program.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-text-muted">{program.description}</p>
        </div>
        {program.isActive && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-primary/15 px-2 py-0.5 text-[10px] font-medium text-accent-primary">
            <CheckCircle2 size={10} /> Actif
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
        <span className="rounded-full border border-white/10 px-2 py-0.5">{TYPE_LABELS[program.type]}</span>
        {program.level && (
          <span className="rounded-full border border-white/10 px-2 py-0.5">{LEVEL_LABELS[program.level]}</span>
        )}
        {program.daysPerWeek && (
          <span className="flex items-center gap-1 font-mono">
            <Calendar size={12} />
            {program.daysPerWeek}j/sem
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isTemplate ? (
          <button
            onClick={() => start(() => duplicateTemplate(program.id))}
            disabled={pending}
            className="flex-1 rounded-[8px] gradient-accent px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
          >
            {pending ? "..." : "Utiliser ce template"}
          </button>
        ) : program.isActive ? (
          <button
            onClick={() => start(() => deactivateProgram(program.id))}
            disabled={pending}
            className="flex-1 rounded-[8px] border border-white/10 px-3 py-2 text-sm hover:border-danger/40 hover:text-danger disabled:opacity-50"
          >
            {pending ? "..." : "Désactiver"}
          </button>
        ) : (
          <button
            onClick={() => start(() => activateProgram(program.id))}
            disabled={pending}
            className="flex-1 rounded-[8px] gradient-accent px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
          >
            {pending ? "..." : "Activer"}
          </button>
        )}
        {!isTemplate && (
          <button
            onClick={() => {
              if (confirm("Supprimer ce programme ?")) start(() => deleteProgram(program.id));
            }}
            disabled={pending}
            className="rounded-[8px] border border-white/10 p-2 text-text-muted hover:border-danger/40 hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
