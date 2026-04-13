"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MUSCLE_LABELS, EQUIPMENT_LABELS, LEVEL_LABELS } from "@/lib/muscle-labels";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

const MUSCLES = Object.keys(MUSCLE_LABELS) as (keyof typeof MUSCLE_LABELS)[];
const EQUIPMENTS = Object.keys(EQUIPMENT_LABELS) as (keyof typeof EQUIPMENT_LABELS)[];
const LEVELS = Object.keys(LEVEL_LABELS) as (keyof typeof LEVEL_LABELS)[];

export function ExerciseFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  const muscle = params.get("muscle");
  const equipment = params.get("equipment");
  const level = params.get("level");

  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams(params.toString());
      if (search) sp.set("q", search);
      else sp.delete("q");
      sp.delete("page");
      router.replace(`/exercises?${sp.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function setFilter(key: string, value: string | null) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    sp.delete("page");
    router.replace(`/exercises?${sp.toString()}`);
  }

  function clearAll() {
    setSearch("");
    router.replace("/exercises");
  }

  const hasFilters = muscle || equipment || level || search;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un exercice..."
          className="w-full rounded-[8px] border border-white/10 bg-background-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent-primary"
        />
      </div>

      <FilterGroup label="Muscle">
        {MUSCLES.map((m) => (
          <Chip key={m} active={muscle === m} onClick={() => setFilter("muscle", muscle === m ? null : m)}>
            {MUSCLE_LABELS[m]}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Équipement">
        {EQUIPMENTS.map((e) => (
          <Chip key={e} active={equipment === e} onClick={() => setFilter("equipment", equipment === e ? null : e)}>
            {EQUIPMENT_LABELS[e]}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Niveau">
        {LEVELS.map((l) => (
          <Chip key={l} active={level === l} onClick={() => setFilter("level", level === l ? null : l)}>
            {LEVEL_LABELS[l]}
          </Chip>
        ))}
      </FilterGroup>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-danger"
        >
          <X size={12} /> Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
          : "border-white/10 bg-background-card text-text-muted hover:border-white/30 hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
