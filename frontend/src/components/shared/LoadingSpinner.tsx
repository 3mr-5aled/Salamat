import React from "react";

interface LoadingSpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading...",
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
          <span className="text-sm font-semibold text-[#64748B]">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8">
      <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin" />
    </div>
  );
};
