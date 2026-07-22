import { createRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ProfileSetupForm } from "../components/profile/ProfileSetupForm";
import { useProfileSetup } from "../hooks/useProfileSetup";
import { rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/profile-setup",
  component: ProfileSetupComponent,
});

function ProfileSetupComponent() {
  const profileSetupState = useProfileSetup();

  return (
    <div className="flex flex-grow items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#E0F2FE] px-4 py-12 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.06)] border-0 overflow-hidden">
        <CardHeader className="space-y-2 pt-10 pb-6 text-center">
          <CardTitle className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Configure Patient Health Profile
          </CardTitle>
          <CardDescription className="text-sm text-[#64748B] px-6">
            Emergency contact and blood group details are required to schedule slot bookings.
          </CardDescription>
        </CardHeader>

        <ProfileSetupForm {...profileSetupState} />
      </Card>
    </div>
  );
}
