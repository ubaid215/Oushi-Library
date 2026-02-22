import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import type { Metadata } from "next";
import type { AdminUserSession } from "@/types";

export const metadata: Metadata = {
  title: { template: "%s | Oushi Admin", default: "Dashboard" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <main>{children}</main>;
  }

  return (
    <div className="app-shell">
      <AdminSidebar user={session.user as AdminUserSession} />
      <div className="main-content">
        <AdminTopbar user={session.user as AdminUserSession} />
        <main className="page-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
}
