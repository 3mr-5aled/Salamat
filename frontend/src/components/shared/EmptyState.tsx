import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../ui/button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  className = "",
  compact = false,
}: EmptyStateProps) {
  const ActionIcon = action?.icon;

  if (compact) {
    return (
      <div className={`p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        {action && (
          <Button
            onClick={action.onClick}
            variant="outline"
            size="sm"
            className="mt-3 text-xs font-bold"
          >
            {ActionIcon && <ActionIcon size={14} className="mr-1.5" />}
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`py-12 px-6 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/5 border border-[#2563EB]/10 flex items-center justify-center shadow-sm text-[#2563EB]">
        <Icon size={30} className="stroke-[1.75]" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs text-[#64748B] font-medium leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          {ActionIcon && <ActionIcon size={14} className="mr-1.5" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
