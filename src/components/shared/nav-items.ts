import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  BookOpen,
  TrendingUp,
  Timer,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/workouts", label: "Séances", icon: Dumbbell },
  { href: "/programs", label: "Programmes", icon: Calendar },
  { href: "/exercises", label: "Exercices", icon: BookOpen },
  { href: "/progress", label: "Progression", icon: TrendingUp },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/ai", label: "Coach IA", icon: Sparkles },
  { href: "/profile", label: "Profil", icon: User },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((i) =>
  ["/dashboard", "/workouts", "/exercises", "/progress", "/profile"].includes(i.href),
);
