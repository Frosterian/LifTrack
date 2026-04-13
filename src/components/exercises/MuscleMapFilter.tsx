"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MuscleMap } from "./MuscleMap";
import type { MuscleGroup } from "@prisma/client";

export function MuscleMapFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("muscle") as MuscleGroup | null) ?? null;

  function handleClick(muscle: MuscleGroup) {
    const sp = new URLSearchParams(params.toString());
    if (current === muscle) sp.delete("muscle");
    else sp.set("muscle", muscle);
    sp.delete("page");
    router.replace(`/exercises?${sp.toString()}`);
  }

  return (
    <div className="rounded-[12px] border border-white/5 bg-background-card p-4">
      <p className="mb-2 text-center text-xs text-text-muted">
        Clique sur un muscle pour filtrer
      </p>
      <MuscleMap interactive selected={current} onMuscleClick={handleClick} size="md" />
    </div>
  );
}
