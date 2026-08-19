import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export interface DataErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function DataErrorFallback({
  message = "Failed to load data. Please check your connection and try again.",
  onRetry,
  className = "",
}: DataErrorFallbackProps) {
  return (
    <div className={`p-6 rounded-2xl bg-red-50/60 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-100/80 rounded-xl text-red-600 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-red-800">
            Error Loading Data
          </h4>
          <p className="text-xs font-bold text-red-600 mt-0.5">{message}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="border-red-200 hover:bg-red-100/50 text-red-700 text-xs font-bold shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
