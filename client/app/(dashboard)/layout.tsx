"use client";
import { AdminHeader, DashboardSidebar } from "@/components/shared";
import { useDashboardType } from "@/hooks/use-dashboard-type";
import { adminNav, parentNav, teacherNav } from "@/lib/dashboard-nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dashboardType = useDashboardType();

  const getNavConfig = () => {
    switch (dashboardType) {
      case "admin":
        return adminNav;
      case "teacher":
        return teacherNav;
      case "parent":
        return parentNav;
      default:
        return adminNav;
    }
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen flex-col w-full">
        <AdminHeader />
        <div className="flex-1 flex">
          {dashboardType && (
            <DashboardSidebar
              navConfig={getNavConfig()}
              userType={dashboardType}
            />
          )}
          <SidebarInset className="w-full">
            <div className="flex items-center p-4 md:hidden">
              <SidebarTrigger />
              <h1 className="ml-2 text-xl font-bold">
                {dashboardType &&
                  dashboardType.charAt(0).toUpperCase() +
                    dashboardType?.slice(1)}{" "}
                Dashboard
              </h1>
            </div>
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
