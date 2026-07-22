import React from "react";

interface TimeSelectPairProps {
  value: string;
  onChange: (val: string) => void;
  id: string;
}

export const TimeSelectPair: React.FC<TimeSelectPairProps> = ({ value, onChange, id }) => {
  const timeVal = value || "08:00";
  const [h, m] = timeVal.split(":");
  const currentHour = h || "08";
  const currentMin = m || "00";

  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${currentMin}`);
  };

  const handleMinChange = (newMin: string) => {
    onChange(`${currentHour}:${newMin}`);
  };

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  return (
    <div className="flex gap-1.5 items-center w-full">
      <select
        id={`${id}-h`}
        value={currentHour}
        onChange={(e) => handleHourChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB] w-full"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="text-slate-400 font-bold">:</span>
      <select
        id={`${id}-m`}
        value={currentMin}
        onChange={(e) => handleMinChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB] w-full"
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
};
