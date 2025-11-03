// front-end/src/app/layout.tsx
import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Salon CRM",
  description: "Salon Customer Relationship Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
    <AppSidebar variant="inset" />
    {children}
    </SidebarProvider>
    </main>
  );
}