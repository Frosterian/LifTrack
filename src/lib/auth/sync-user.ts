import { prisma } from "@/lib/prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as PrismaUser } from "@prisma/client";

export async function syncUser(supabaseUser: SupabaseUser): Promise<PrismaUser> {
  const existing = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (existing) return existing;

  const email = supabaseUser.email!;
  const meta = supabaseUser.user_metadata ?? {};
  const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

  return prisma.user.create({
    data: {
      supabaseId: supabaseUser.id,
      email,
      firstName: meta.firstName ?? meta.first_name ?? null,
      lastName: meta.lastName ?? meta.last_name ?? null,
      username: meta.username ?? null,
      role: isAdmin ? "ADMIN" : "USER",
    },
  });
}
