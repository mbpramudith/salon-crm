// front-end/src/app/layout.tsx
import type { Metadata } from "next";

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
      <div>Side Bar</div>
      {children}
    </main>
  );
}