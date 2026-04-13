import Link from "next/link";
import { requireAdmin } from "@/lib/auth/get-user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-accent-primary/20 bg-background-card px-6 py-4">
        <Link href="/admin" className="text-xl font-bold text-accent-primary">
          LifTrack · Admin
        </Link>
        <Link href="/dashboard" className="text-sm text-text-muted hover:text-text">
          ← Retour à l&apos;app
        </Link>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
