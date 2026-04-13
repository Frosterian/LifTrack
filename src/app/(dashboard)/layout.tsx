import Link from "next/link";
import { requireUser } from "@/lib/auth/get-user";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-white/5 bg-background-card px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold gradient-text">
          LifTrack
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">{user.email}</span>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full border border-accent-primary/40 px-3 py-1 text-accent-primary"
            >
              Admin
            </Link>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-text-muted hover:text-danger">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
