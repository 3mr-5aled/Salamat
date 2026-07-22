import React from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { rootRoute } from "./__root";
import { Clock, LogOut, ShieldCheck } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/waiting-for-verification",
  component: WaitingForVerificationComponent,
});

function WaitingForVerificationComponent() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate({ to: "/app/login" });
      } else if (user && user.role === "doctor" && user.isActive === true) {
        navigate({ to: "/app" });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
          <span className="text-sm font-semibold text-[#64748B]">Loading verification status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#E0F2FE] px-4 py-12 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.06)] p-10 text-center border-0">
        {/* Pulsing Pending Clock Icon */}
        <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center text-[#F59E0B] mx-auto mb-6">
          <Clock size={40} className="animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
          <span>Pending Credentials Review</span>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-3">
          Verification in Progress
        </h2>
        
        <p className="text-sm text-[#64748B] leading-relaxed mb-8">
          Thank you for registering as a medical professional on Salamat, <strong className="text-[#0F172A]">{user?.name}</strong>. 
          Our clinical administration team is currently reviewing your licensing and credentials to ensure patient safety. 
          This process typically takes <span className="font-semibold text-[#0F172A]">24 to 48 hours</span>.
        </p>

        {/* Security & Support Note */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3 text-left mb-8">
          <ShieldCheck className="text-[#14B8A6] shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#0F172A]">Credentials Protection</h4>
            <p className="text-[11px] text-[#64748B] leading-normal">
              Your documents are encrypted and handled in compliance with medical confidentiality standards. We will notify you by email once your account is active.
            </p>
          </div>
        </div>

        {/* Sign Out CTA */}
        <Button
          onClick={logout}
          variant="outline"
          className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#DC2626] hover:border-[#DC2626]/20 rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
