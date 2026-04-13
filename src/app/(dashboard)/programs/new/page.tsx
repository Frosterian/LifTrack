import { prisma } from "@/lib/prisma/client";
import { CreateProgramForm } from "./create-form";

export default async function NewProgramPage() {
  const exercises = await prisma.exercise.findMany({
    where: { isGlobal: true },
    select: { id: true, name: true, equipment: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Créer un programme</h1>
      <CreateProgramForm exercises={exercises} />
    </div>
  );
}
