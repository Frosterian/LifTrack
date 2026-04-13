import { prisma } from "@/lib/prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as PrismaUser } from "@prisma/client";

export async function syncUser(supabaseUser: SupabaseUser): Promise<PrismaUser> {
  const email = supabaseUser.email!;
  const meta = supabaseUser.user_metadata ?? {};
  const isAdmin = !!process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

  const bySupabaseId = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });
  if (bySupabaseId) return bySupabaseId;

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { supabaseId: supabaseUser.id },
    });
  }

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
