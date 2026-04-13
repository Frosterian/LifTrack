import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-6xl font-bold tracking-tight gradient-text">LifTrack</h1>
      <p className="mt-6 max-w-xl text-text-muted">
        Suivi de musculation moderne avec timers, bibliothèque d&apos;exercices et coach IA.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/register"
          className="rounded-[8px] gradient-accent px-6 py-3 font-semibold text-background"
        >
          Commencer gratuitement
        </Link>
        <Link
          href="/login"
          className="rounded-[8px] border border-white/10 bg-background-card px-6 py-3 font-semibold transition hover:border-accent-primary/40"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
