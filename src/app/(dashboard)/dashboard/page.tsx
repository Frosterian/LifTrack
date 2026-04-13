import { requireUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">
        Bonjour {user.firstName ?? user.email.split("@")[0]} 👋
      </h1>
      <p className="mt-2 text-text-muted">Phase 2 : auth en place. Le dashboard arrive bientôt.</p>
      <div className="mt-8 rounded-[12px] border border-white/5 bg-background-card p-6">
        <p className="font-mono text-sm text-accent-primary">Rôle : {user.role}</p>
      </div>
    </div>
  );
}
