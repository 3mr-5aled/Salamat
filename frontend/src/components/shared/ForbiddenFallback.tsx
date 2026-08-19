import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";

export interface ForbiddenFallbackProps {
  requiredRole?: string;
  customMessage?: string;
}

export function ForbiddenFallback({
  requiredRole,
  customMessage,
}: ForbiddenFallbackProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const userDashboardPath =
    isAuthenticated && user?.role === "admin"
      ? "/app/admin"
      : isAuthenticated
        ? "/app"
        : "/";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="text-center max-w-md w-full space-y-8 animate-fade-in">
        {/* Shield Icon Badge */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_10px_30px_rgba(239,68,68,0.1)] text-red-600">
            <ShieldAlert size={52} className="stroke-[1.5]" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            403 — Access Denied
          </p>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-[#64748B] font-medium leading-relaxed">
            {customMessage ||
              `You do not have permission to access this area. ${
                requiredRole ? `This portal requires "${requiredRole}" privileges.` : ""
              }`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={userDashboardPath}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span>Return to My Dashboard</span>
          </Link>
          <button
            onClick={logout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-white hover:bg-red-50/50 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
