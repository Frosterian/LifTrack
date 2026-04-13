import { requireUser } from "@/lib/auth/get-user";
import { Sidebar } from "@/components/shared/Sidebar";
import { BottomNav } from "@/components/shared/BottomNav";
import { MobileHeader } from "@/components/shared/MobileHeader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={{ email: user.email, firstName: user.firstName, role: user.role }}
      />
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
