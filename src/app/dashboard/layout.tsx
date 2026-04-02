import { Manrope } from "next/font/google";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireCurrentUserContext } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

const dashboardFont = Manrope({
  subsets: ["latin"],
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, isAdmin } = await requireCurrentUserContext();

  return (
    <div className={dashboardFont.className}>
      <DashboardShell profile={profile} isAdmin={isAdmin}>
        {children}
      </DashboardShell>
    </div>
  );
}
