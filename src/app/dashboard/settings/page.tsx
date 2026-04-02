import { AdminPageIntro } from "@/components/dashboard/admin/AdminPrimitives";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { requireCurrentUserContext } from "@/lib/portal-data";

export default async function SettingsPage() {
  const { profile, isAdmin } = await requireCurrentUserContext();

  return (
    <div className={isAdmin ? "space-y-8" : "mx-auto max-w-3xl space-y-6"}>
      {isAdmin ? (
        <AdminPageIntro
          eyebrow="Settings"
          title="Tune the operator workspace to match how you run delivery."
          description="Update the admin identity and notification defaults that sit behind the command room."
        />
      ) : (
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage the details and notification preferences tied to your portal workspace.
          </p>
        </div>
      )}

      <SettingsForm profile={profile} isAdmin={isAdmin} />
    </div>
  );
}
