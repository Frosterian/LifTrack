import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/auth/sync-user";
import type { User as PrismaUser } from "@prisma/client";

export async function requireUser(): Promise<PrismaUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return syncUser(user);
}

export async function requireAdmin(): Promise<PrismaUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
