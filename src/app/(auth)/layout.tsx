import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-10 text-3xl font-bold gradient-text">
        LifTrack
      </Link>
      <div className="w-full max-w-md rounded-[12px] border border-white/5 bg-background-card p-8 shadow-[0_0_40px_rgba(0,245,160,0.05)]">
        {children}
      </div>
    </div>
  );
}
