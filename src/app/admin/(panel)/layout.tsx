import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
