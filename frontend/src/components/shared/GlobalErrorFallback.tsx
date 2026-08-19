import { useState } from "react";
import { AlertCircle, RefreshCw, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

export interface GlobalErrorFallbackProps {
  error?: Error | unknown;
  reset?: () => void;
}

export function GlobalErrorFallback({
  error,
  reset,
}: GlobalErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage: string =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An unexpected error occurred.";

  const errorStack = error instanceof Error ? error.stack : null;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="text-center max-w-lg w-full space-y-6 animate-fade-in">
        {/* Error Badge */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg text-red-600">
            <AlertCircle size={48} className="stroke-[1.5]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Application Error
          </p>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
            Something Went Wrong
          </h1>
          <p className="text-sm text-[#64748B] font-medium leading-relaxed">
            An unexpected application error has occurred. We've logged this issue, and you can try recovering your session below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {reset && (
            <Button
              onClick={reset}
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Try Again</span>
            </Button>
          )}
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Reload Page</span>
          </Button>
        </div>

        {/* Technical Details Toggle */}
        {Boolean(error) && (
          <div className="pt-4 border-t border-slate-200/80">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span>{showDetails ? "Hide Technical Details" : "Show Technical Details"}</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showDetails && (
              <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-left text-xs font-mono overflow-x-auto max-h-48 border border-slate-800 space-y-2">
                <p className="font-bold text-red-400">{errorMessage}</p>
                {errorStack && (
                  <pre className="text-[11px] text-slate-400 whitespace-pre-wrap leading-normal">
                    {errorStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
