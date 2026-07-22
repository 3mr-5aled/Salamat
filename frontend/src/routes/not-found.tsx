import { createRoute, Link } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: NotFoundComponent,
});

function NotFoundComponent() {
  const { user, isAuthenticated } = useAuth();

  const dashboardPath =
    isAuthenticated && user?.role === "admin"
      ? "/app/admin"
      : isAuthenticated
        ? "/app"
        : "/";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="text-center max-w-md w-full space-y-8 animate-fade-in">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-3xl bg-[#2563EB]/5 border border-[#2563EB]/10 flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.06)]">
            <SearchX size={52} className="text-[#2563EB]/40 stroke-[1.5]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]/60">
            404 — Not Found
          </p>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-[#64748B] font-medium leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={dashboardPath}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all duration-200"
          >
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#0F172A] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
