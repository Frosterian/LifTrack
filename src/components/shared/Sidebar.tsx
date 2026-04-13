"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: { email: string; firstName: string | null; role: string };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-white/5 md:bg-background-card md:px-4 md:py-6">
      <Link href="/dashboard" className="mb-8 px-2 text-2xl font-bold gradient-text">
        LifTrack
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition",
                active
                  ? "bg-background-hover text-accent-primary"
                  : "text-text-muted hover:bg-background-hover hover:text-text",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="block rounded-[8px] border border-accent-primary/30 px-3 py-2 text-center text-xs font-semibold text-accent-primary"
          >
            Admin
          </Link>
        )}
        <div className="px-2 text-xs text-text-muted truncate">{user.email}</div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-[8px] px-3 py-2 text-left text-sm text-text-muted hover:text-danger"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
