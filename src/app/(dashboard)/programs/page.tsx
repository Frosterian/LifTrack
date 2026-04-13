import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "@/lib/auth/get-user";
import { ProgramCard } from "@/components/programs/ProgramCard";

export default async function ProgramsPage() {
  const user = await requireUser();
  const [mine, templates] = await Promise.all([
    prisma.program.findMany({
      where: { userId: user.id, isTemplate: false },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    }),
    prisma.program.findMany({
      where: { isTemplate: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Programmes</h1>
        <Link
          href="/programs/new"
          className="flex items-center gap-2 rounded-[8px] gradient-accent px-4 py-2 text-sm font-semibold text-background"
        >
          <Plus size={16} /> Créer
        </Link>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Mes programmes</h2>
        {mine.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-white/10 bg-background-card p-8 text-center text-sm text-text-muted">
            Aucun programme. Crées-en un ou utilise un template ci-dessous.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((p) => (
            <ProgramCard key={p.id} program={p} isTemplate />
          ))}
        </div>
      </section>
    </div>
  );
}
