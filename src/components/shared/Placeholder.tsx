export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-6 rounded-[12px] border border-white/5 bg-background-card p-8 text-center">
        <p className="font-mono text-sm text-accent-primary">{phase}</p>
        <p className="mt-2 text-text-muted">Cette section sera implémentée prochainement.</p>
      </div>
    </div>
  );
}
