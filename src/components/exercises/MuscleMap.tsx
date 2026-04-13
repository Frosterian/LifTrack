"use client";

import { useState } from "react";
import type { MuscleGroup } from "@prisma/client";
import { cn } from "@/lib/utils";

interface MuscleMapProps {
  highlightPrimary?: MuscleGroup[];
  highlightSecondary?: MuscleGroup[];
  interactive?: boolean;
  onMuscleClick?: (muscle: MuscleGroup) => void;
  selected?: MuscleGroup | null;
  size?: "sm" | "md" | "lg";
}

// Stylized human silhouette — chaque muscle = un path avec data-muscle
// Front view : colonne x 0-200, Back view : colonne x 220-420
type Region = { muscle: MuscleGroup; d: string };

const FRONT: Region[] = [
  // Tête (décorative, non cliquable)
  // Trapèzes (haut épaules visibles de face)
  { muscle: "TRAPS", d: "M 80 70 Q 100 75 120 70 L 128 84 Q 100 80 72 84 Z" },
  // Épaules (deltoïdes antérieurs gauche + droit)
  { muscle: "SHOULDERS", d: "M 56 80 Q 72 76 78 92 Q 70 102 56 96 Z" },
  { muscle: "SHOULDERS", d: "M 144 80 Q 128 76 122 92 Q 130 102 144 96 Z" },
  // Pectoraux
  { muscle: "CHEST", d: "M 72 92 Q 100 88 128 92 L 124 124 Q 100 130 76 124 Z" },
  // Abdos
  { muscle: "ABS", d: "M 86 130 L 114 130 L 114 200 L 86 200 Z" },
  // Biceps
  { muscle: "BICEPS", d: "M 50 100 Q 60 100 60 140 Q 50 144 42 132 Z" },
  { muscle: "BICEPS", d: "M 150 100 Q 140 100 140 140 Q 150 144 158 132 Z" },
  // Avant-bras
  { muscle: "FOREARMS", d: "M 42 144 Q 54 142 54 188 Q 44 192 34 176 Z" },
  { muscle: "FOREARMS", d: "M 158 144 Q 146 142 146 188 Q 156 192 166 176 Z" },
  // Quadriceps
  { muscle: "QUADRICEPS", d: "M 78 210 Q 96 210 96 290 Q 84 296 72 282 Z" },
  { muscle: "QUADRICEPS", d: "M 122 210 Q 104 210 104 290 Q 116 296 128 282 Z" },
  // Mollets (vue de face)
  { muscle: "CALVES", d: "M 78 320 Q 92 320 92 380 Q 82 386 72 370 Z" },
  { muscle: "CALVES", d: "M 122 320 Q 108 320 108 380 Q 118 386 128 370 Z" },
];

const BACK: Region[] = [
  // Trapèzes (vrai trap, plus visible de dos)
  { muscle: "TRAPS", d: "M 78 70 Q 100 88 122 70 L 128 100 Q 100 96 72 100 Z" },
  // Épaules (deltoïdes postérieurs)
  { muscle: "SHOULDERS", d: "M 56 84 Q 72 80 78 96 Q 70 106 56 100 Z" },
  { muscle: "SHOULDERS", d: "M 144 84 Q 128 80 122 96 Q 130 106 144 100 Z" },
  // Lats
  { muscle: "LATS", d: "M 72 102 Q 56 130 70 178 L 92 168 L 90 108 Z" },
  { muscle: "LATS", d: "M 128 102 Q 144 130 130 178 L 108 168 L 110 108 Z" },
  // Lower back
  { muscle: "BACK", d: "M 88 145 L 112 145 L 110 200 L 90 200 Z" },
  // Triceps
  { muscle: "TRICEPS", d: "M 42 105 Q 54 102 54 142 Q 42 148 32 134 Z" },
  { muscle: "TRICEPS", d: "M 158 105 Q 146 102 146 142 Q 158 148 168 134 Z" },
  // Avant-bras (face postérieure)
  { muscle: "FOREARMS", d: "M 34 148 Q 46 145 50 188 Q 38 192 28 176 Z" },
  { muscle: "FOREARMS", d: "M 166 148 Q 154 145 150 188 Q 162 192 172 176 Z" },
  // Fessiers
  { muscle: "GLUTES", d: "M 78 210 Q 100 210 100 255 Q 88 260 76 244 Z" },
  { muscle: "GLUTES", d: "M 122 210 Q 100 210 100 255 Q 112 260 124 244 Z" },
  // Ischios
  { muscle: "HAMSTRINGS", d: "M 78 265 Q 96 265 96 318 Q 84 324 72 308 Z" },
  { muscle: "HAMSTRINGS", d: "M 122 265 Q 104 265 104 318 Q 116 324 128 308 Z" },
  // Mollets
  { muscle: "CALVES", d: "M 78 330 Q 92 330 92 395 Q 82 400 72 384 Z" },
  { muscle: "CALVES", d: "M 122 330 Q 108 330 108 395 Q 118 400 128 384 Z" },
];

const SIZE_CLASSES = {
  sm: "max-w-[280px]",
  md: "max-w-[420px]",
  lg: "max-w-[560px]",
};

export function MuscleMap({
  highlightPrimary = [],
  highlightSecondary = [],
  interactive = false,
  onMuscleClick,
  selected = null,
  size = "md",
}: MuscleMapProps) {
  const [hover, setHover] = useState<MuscleGroup | null>(null);

  function getFill(muscle: MuscleGroup): string {
    if (highlightPrimary.includes(muscle)) return "#00F5A0";
    if (highlightSecondary.includes(muscle)) return "rgba(0,245,160,0.35)";
    if (selected === muscle) return "#00F5A0";
    if (interactive && hover === muscle) return "rgba(0,245,160,0.55)";
    return "#1A1A2E";
  }

  function renderRegion(r: Region, key: string) {
    return (
      <path
        key={key}
        d={r.d}
        data-muscle={r.muscle}
        fill={getFill(r.muscle)}
        stroke="#0A0A0F"
        strokeWidth={1}
        style={{
          cursor: interactive ? "pointer" : "default",
          transition: "fill 200ms",
        }}
        onMouseEnter={() => interactive && setHover(r.muscle)}
        onMouseLeave={() => interactive && setHover(null)}
        onClick={() => interactive && onMuscleClick?.(r.muscle)}
      />
    );
  }

  return (
    <div className={cn("mx-auto w-full", SIZE_CLASSES[size])}>
      <svg viewBox="0 0 420 440" className="w-full">
        {/* FRONT */}
        <g>
          {/* Tête + cou */}
          <ellipse cx={100} cy={40} rx={22} ry={26} fill="#1A1A2E" stroke="#0A0A0F" strokeWidth={1} />
          <rect x={92} y={62} width={16} height={12} fill="#1A1A2E" />
          {FRONT.map((r, i) => renderRegion(r, `f-${i}`))}
          <text x={100} y={430} textAnchor="middle" fill="#8888AA" fontSize={11}>
            Face
          </text>
        </g>
        {/* BACK (offset 220) */}
        <g transform="translate(220, 0)">
          <ellipse cx={100} cy={40} rx={22} ry={26} fill="#1A1A2E" stroke="#0A0A0F" strokeWidth={1} />
          <rect x={92} y={62} width={16} height={12} fill="#1A1A2E" />
          {BACK.map((r, i) => renderRegion(r, `b-${i}`))}
          <text x={100} y={430} textAnchor="middle" fill="#8888AA" fontSize={11}>
            Dos
          </text>
        </g>
      </svg>
    </div>
  );
}
