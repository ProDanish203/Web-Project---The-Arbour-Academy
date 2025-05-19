import type React from "react";
import { GraduationCap, Home, Users, Clock } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  submenu?: NavItem[];
};

export type DashboardNavConfig = {
  mainNav: NavItem[];
};

export const adminNav: DashboardNavConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Admissions",
      href: "/dashboard/admin/admissions",
      icon: Users,
    },
    {
      title: "Teachers",
      href: "/dashboard/admin/teachers",
      icon: GraduationCap,
    },
  ],
};

export const teacherNav: DashboardNavConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard/teacher",
      icon: Home,
    },
    {
      title: "Attendance",
      href: "/dashboard/teacher/attendance",
      icon: Clock,
    },
  ],
};

export const parentNav: DashboardNavConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard/parent",
      icon: Home,
    },
    {
      title: "My Children",
      href: "/dashboard/parent/children",
      icon: Users,
    },
  ],
};
