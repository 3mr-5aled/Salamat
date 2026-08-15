import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AdminModals } from "../components/admin/AdminModals";
import { AdminTabs } from "../components/admin/AdminTabs";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useModal } from "../contexts/ModalContext";

import { NotificationBell } from "../components/NotificationBell";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/admin",
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  const admin = useAdminDashboard();
  const { user, logout, authLoading } = useAuth() as any;
  const { prompt: customPrompt, confirm: customConfirm } = useModal();

  if (admin.loading || authLoading) {
    return <LoadingSpinner label="Loading admin dashboard..." fullScreen />;
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F8FAFC] overflow-y-auto">
      {/* Static Fixed-Width Container */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 flex-1 flex flex-col">
        {/* Sticky Header & Tab Navigation Container */}
        <div className="sticky top-0 z-30 bg-[#F8FAFC] pt-2 pb-4 space-y-4">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2563EB]/10 rounded-2xl text-[#2563EB]">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0F172A]">Administrative Control Panel</h1>
                <p className="text-xs text-[#64748B] font-medium">
                  Manage clinics, assign medical personnel, and coordinate patients directory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell align="right" />
            </div>
          </div>

          {/* Global Status Banner */}
          {admin.actionError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-[#DC2626] text-xs p-4 rounded-2xl font-medium">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <span>{admin.actionError}</span>
            </div>
          )}
          {admin.actionSuccess && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 text-[#16A34A] text-xs p-4 rounded-2xl font-medium">
              <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
              <span>{admin.actionSuccess}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {(["overview", "approvals", "clinics", "doctors", "patients", "slots", "messages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  admin.setActiveTab(tab);
                  admin.setActionError(null);
                  admin.setActionSuccess(null);
                }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  admin.activeTab === tab
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab === "messages" ? (
                  <>
                    <span>Doctor Messages</span>
                    {admin.unreadAdminMessagesCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-extrabold">
                        {admin.unreadAdminMessagesCount}
                      </span>
                    )}
                  </>
                ) : tab === "approvals" ? (
                  <>
                    <span>Pending Approvals</span>
                    {admin.pendingAppointments?.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-extrabold">
                        {admin.pendingAppointments.length}
                      </span>
                    )}
                  </>
                ) : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents - Dynamic Content with Static Width Container */}
        <div className="flex-1 w-full min-w-0">
          <AdminTabs admin={admin} />
        </div>

        {/* Admin Modals */}
        <AdminModals admin={admin} />

        {/* Modern Admin Footer */}
        <footer className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold mt-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <span className="text-[10px] font-black uppercase">A</span>
            </div>
            <span>Logged in as: <strong className="text-slate-800">{user?.fullName || user?.name || "Admin"}</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                const bugDesc = await customPrompt({
                  title: "Report a Bug",
                  message: "Please describe the bug you found (minimum 10 characters):",
                  placeholder: "Enter bug description...",
                  minLength: 10,
                  required: true
                });
                if (bugDesc) {
                  await customConfirm({
                    title: "Report Submitted",
                    message: "Thank you! Your bug report has been submitted to the developers.",
                    confirmText: "OK",
                    cancelText: "Close",
                    variant: "primary",
                  });
                }
              }}
              className="hover:text-[#2563EB] cursor-pointer transition-colors"
            >
              Report a Bug
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={logout}
              className="text-[#DC2626] hover:underline cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
