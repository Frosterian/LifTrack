import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-background-card px-4 py-3 md:hidden">
      <Link href="/dashboard" className="text-lg font-bold gradient-text">
        LifTrack
      </Link>
      <form action="/auth/signout" method="post">
        <button type="submit" className="text-xs text-text-muted">
          Déco
        </button>
      </form>
    </header>
  );
}
