import { createRoute, Link } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Wrench, RefreshCw, Clock } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/maintenance",
  component: MaintenanceComponent,
});

function MaintenanceComponent() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="text-center max-w-md w-full space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.06)]">
            <Wrench size={52} className="text-amber-400/60 stroke-[1.5]" />
            {/* Animated pulse */}
            <span className="absolute top-3 right-3 block w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.15)] animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/70">
            Scheduled Maintenance
          </p>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
            We'll Be Right Back
          </h1>
          <p className="text-sm text-[#64748B] font-medium leading-relaxed">
            Salamat is currently undergoing scheduled maintenance to improve
            your experience. We apologize for any inconvenience and appreciate
            your patience.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl shrink-0">
              <Clock size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800">Expected Duration</p>
              <p className="text-[11px] text-amber-600 font-medium">Typically less than 1 hour</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl shrink-0">
              <RefreshCw size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800">What to do</p>
              <p className="text-[11px] text-amber-600 font-medium">
                Refresh this page in a few minutes. Your data is safe.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all duration-200 cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
          <Link
            to="/app"
            className="flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#0F172A] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 rounded-xl transition-all duration-200"
          >
            <span>Go to Home</span>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-slate-400 font-medium">
          If this persists, please contact{" "}
          <span className="text-[#2563EB] font-semibold">support@salamat-clinics.com</span>
        </p>
      </div>
    </div>
  );
}

export default MaintenanceComponent;
