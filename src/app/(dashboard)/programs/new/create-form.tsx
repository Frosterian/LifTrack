"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";
import { createProgram } from "../actions";

interface ExerciseOption {
  id: string;
  name: string;
  equipment: string;
}

interface ExerciseEntry {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number | null;
}

interface DayEntry {
  name: string;
  dayOfWeek: number | null;
  exercises: ExerciseEntry[];
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

const fieldClass =
  "w-full rounded-[8px] border border-white/10 bg-background-hover px-3 py-2 text-sm outline-none focus:border-accent-primary";

export function CreateProgramForm({ exercises }: { exercises: ExerciseOption[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("CUSTOM");
  const [level, setLevel] = useState("");
  const [days, setDays] = useState<DayEntry[]>([
    { name: "Jour 1", dayOfWeek: null, exercises: [] },
  ]);

  function addDay() {
    setDays((d) => [...d, { name: `Jour ${d.length + 1}`, dayOfWeek: null, exercises: [] }]);
  }

  function removeDay(i: number) {
    setDays((d) => d.filter((_, idx) => idx !== i));
  }

  function updateDay(i: number, patch: Partial<DayEntry>) {
    setDays((d) => d.map((day, idx) => (idx === i ? { ...day, ...patch } : day)));
  }

  function addExercise(dayIdx: number) {
    setDays((d) =>
      d.map((day, idx) =>
        idx !== dayIdx
          ? day
          : {
              ...day,
              exercises: [
                ...day.exercises,
                { exerciseId: exercises[0]?.id ?? "", targetSets: 3, targetReps: "8-12", restSeconds: 90 },
              ],
            },
      ),
    );
  }

  function updateExercise(dayIdx: number, exIdx: number, patch: Partial<ExerciseEntry>) {
    setDays((d) =>
      d.map((day, idx) =>
        idx !== dayIdx
          ? day
          : {
              ...day,
              exercises: day.exercises.map((ex, j) => (j === exIdx ? { ...ex, ...patch } : ex)),
            },
      ),
    );
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays((d) =>
      d.map((day, idx) =>
        idx !== dayIdx ? day : { ...day, exercises: day.exercises.filter((_, j) => j !== exIdx) },
      ),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (days.some((d) => d.exercises.length === 0)) {
      setError("Chaque jour doit contenir au moins un exercice.");
      return;
    }

    start(async () => {
      try {
        const res = await createProgram({
          name,
          description: description || undefined,
          type: type as "PPL" | "UPPER_LOWER" | "FULL_BODY" | "BRO_SPLIT" | "CUSTOM",
          level: (level || undefined) as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | undefined,
          daysPerWeek: days.length,
          days: days.map((d) => ({
            name: d.name,
            dayOfWeek: d.dayOfWeek,
            exercises: d.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
              restSeconds: e.restSeconds,
            })),
          })),
        });
        router.push(`/programs/${res.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[12px] border border-white/5 bg-background-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Informations</h2>
        <div className="space-y-3">
          <input
            required
            placeholder="Nom du programme"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
          <textarea
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={fieldClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
              <option value="CUSTOM">Personnalisé</option>
              <option value="PPL">Push/Pull/Legs</option>
              <option value="UPPER_LOWER">Upper / Lower</option>
              <option value="FULL_BODY">Full Body</option>
              <option value="BRO_SPLIT">Bro Split</option>
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={fieldClass}>
              <option value="">Niveau...</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>
          </div>
        </div>
      </section>

      {days.map((day, dayIdx) => (
        <DayBlock
          key={dayIdx}
          day={day}
          dayIdx={dayIdx}
          exercises={exercises}
          canRemove={days.length > 1}
          onUpdate={(patch) => updateDay(dayIdx, patch)}
          onRemove={() => removeDay(dayIdx)}
          onAddExercise={() => addExercise(dayIdx)}
          onUpdateExercise={(exIdx, patch) => updateExercise(dayIdx, exIdx, patch)}
          onRemoveExercise={(exIdx) => removeExercise(dayIdx, exIdx)}
        />
      ))}

      <button
        type="button"
        onClick={addDay}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-white/15 bg-background-card py-4 text-sm text-text-muted hover:border-accent-primary/40 hover:text-accent-primary"
      >
        <Plus size={16} /> Ajouter un jour
      </button>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={pending || !name}
        className="w-full rounded-[8px] gradient-accent py-3 font-semibold text-background disabled:opacity-50"
      >
        {pending ? "Création..." : "Créer le programme"}
      </button>
    </form>
  );
}

function DayBlock({
  day,
  dayIdx,
  exercises,
  canRemove,
  onUpdate,
  onRemove,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
}: {
  day: DayEntry;
  dayIdx: number;
  exercises: ExerciseOption[];
  canRemove: boolean;
  onUpdate: (patch: Partial<DayEntry>) => void;
  onRemove: () => void;
  onAddExercise: () => void;
  onUpdateExercise: (exIdx: number, patch: Partial<ExerciseEntry>) => void;
  onRemoveExercise: (exIdx: number) => void;
}) {
  const exerciseOptions = useMemo(
    () =>
      exercises.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      )),
    [exercises],
  );

  return (
    <section className="rounded-[12px] border border-white/5 bg-background-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <input
          value={day.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="flex-1 rounded-[8px] border border-transparent bg-transparent px-2 py-1 text-base font-semibold outline-none focus:border-white/10"
        />
        <select
          value={day.dayOfWeek ?? ""}
          onChange={(e) => onUpdate({ dayOfWeek: e.target.value ? Number(e.target.value) : null })}
          className="rounded-[8px] border border-white/10 bg-background-hover px-2 py-1 text-xs"
        >
          <option value="">Jour libre</option>
          {DAYS_OF_WEEK.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-[8px] p-1.5 text-text-muted hover:text-danger"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {day.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="flex items-center gap-2 rounded-[8px] border border-white/5 bg-background-hover p-2">
            <select
              value={ex.exerciseId}
              onChange={(e) => onUpdateExercise(exIdx, { exerciseId: e.target.value })}
              className="flex-1 min-w-0 rounded-[6px] border border-white/10 bg-background-card px-2 py-1.5 text-xs"
            >
              {exerciseOptions}
            </select>
            <input
              type="number"
              min={1}
              max={20}
              value={ex.targetSets}
              onChange={(e) => onUpdateExercise(exIdx, { targetSets: Number(e.target.value) })}
              className="w-14 rounded-[6px] border border-white/10 bg-background-card px-2 py-1.5 text-center font-mono text-xs"
              title="Séries"
            />
            <input
              value={ex.targetReps}
              onChange={(e) => onUpdateExercise(exIdx, { targetReps: e.target.value })}
              className="w-20 rounded-[6px] border border-white/10 bg-background-card px-2 py-1.5 text-center font-mono text-xs"
              title="Reps"
            />
            <input
              type="number"
              min={0}
              max={600}
              step={15}
              value={ex.restSeconds ?? ""}
              onChange={(e) =>
                onUpdateExercise(exIdx, {
                  restSeconds: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-16 rounded-[6px] border border-white/10 bg-background-card px-2 py-1.5 text-center font-mono text-xs"
              title="Repos (s)"
            />
            <button
              type="button"
              onClick={() => onRemoveExercise(exIdx)}
              className="rounded-[6px] p-1 text-text-muted hover:text-danger"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddExercise}
        className="mt-3 flex items-center gap-1 text-xs text-accent-secondary hover:underline"
      >
        <Plus size={12} /> Exercice
      </button>
    </section>
  );
}
