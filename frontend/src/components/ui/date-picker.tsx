import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DatePickerProps {
  value?: string; // Format: YYYY-MM-DD
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string | number; // Format: YYYY-MM-DD
  max?: string | number; // Format: YYYY-MM-DD
  placeholder?: string;
  id?: string;
  className?: string;
  name?: string;
  required?: boolean;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const parseDateString = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateToString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value = "", onChange, min, max, placeholder = "Select date", id, className, name, required }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Parse currently selected date
    const selectedDate = value ? parseDateString(value) : null;
    
    // Keep track of the month currently being viewed in the calendar
    const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

    // Sync viewDate when value changes
    useEffect(() => {
      if (selectedDate) {
        setViewDate(selectedDate);
      }
    }, [value]);

    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSelectDay = (day: number, offsetMonth: number) => {
      let targetYear = viewDate.getFullYear();
      let targetMonth = viewDate.getMonth() + offsetMonth;

      // Handle month overflow/underflow
      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear -= 1;
      } else if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }

      const newDate = new Date(targetYear, targetMonth, day);
      const dateStr = formatDateToString(newDate);

      // Trigger standard React / React Hook Form change event
      if (onChange) {
        onChange({
          target: {
            name: name || id || "",
            value: dateStr,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      setIsOpen(false);
    };

    const handlePrevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    // Calendar grid calculations
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month); // 0 = Sunday, 1 = Monday, etc.

    // Days in previous month to display as leading days
    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

    const leadingDaysCount = firstDayIndex;
    const leadingDays = [];
    for (let i = leadingDaysCount - 1; i >= 0; i--) {
      leadingDays.push(daysInPrevMonth - i);
    }

    // Days in current month
    const currentDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentDays.push(i);
    }

    // Days in next month to display as trailing days (to fill exactly 42 slots of a 6-row grid)
    const totalSlots = 42;
    const trailingDaysCount = totalSlots - (leadingDays.length + currentDays.length);
    const trailingDays = [];
    for (let i = 1; i <= trailingDaysCount; i++) {
      trailingDays.push(i);
    }

    // Date boundary checks
    const minStr = typeof min === "number" ? String(min) : min;
    const maxStr = typeof max === "number" ? String(max) : max;
    const minDateLimit = minStr ? parseDateString(minStr) : null;
    const maxDateLimit = maxStr ? parseDateString(maxStr) : null;

    const isDayDisabled = (day: number, offsetMonth: number) => {
      let dYear = year;
      let dMonth = month + offsetMonth;
      if (dMonth < 0) {
        dMonth = 11;
        dYear -= 1;
      } else if (dMonth > 11) {
        dMonth = 0;
        dYear += 1;
      }
      const checkDate = new Date(dYear, dMonth, day);
      
      if (minDateLimit && checkDate < minDateLimit) return true;
      if (maxDateLimit && checkDate > maxDateLimit) return true;
      return false;
    };

    const isDaySelected = (day: number) => {
      return (
        selectedDate !== null &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      );
    };

    const isDayToday = (day: number) => {
      const today = new Date();
      return (
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year
      );
    };

    // Format display string
    const displayValue = selectedDate
      ? selectedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : placeholder;

    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="relative w-full">
        {/* Under the hood input for label association, testing, and form submission */}
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          required={required}
          ref={ref}
          className="sr-only"
          onChange={onChange}
        />
        
        {/* Trigger Button */}
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left font-normal border border-slate-200 rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] flex items-center gap-2.5 transition-all cursor-pointer",
            !value && "text-slate-400",
            className
          )}
        >
          <CalendarIcon size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">{displayValue}</span>
        </button>

        {/* Popover Calendar Grid */}
        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute left-0 top-full mt-1.5 z-50 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-[280px] origin-top-left animate-fade-in"
          >
            {/* Month Header Navigation with Dropdowns (captionLayout="dropdown") */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1.5">
                <select
                  value={month}
                  onChange={(e) => setViewDate(new Date(year, parseInt(e.target.value, 10), 1))}
                  className="bg-white text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg border border-slate-200 outline-none text-center"
                >
                  {monthNames.map((name, index) => (
                    <option key={name} value={index}>
                      {name.slice(0, 3)}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setViewDate(new Date(parseInt(e.target.value, 10), month, 1))}
                  className="bg-white text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg border border-slate-200 outline-none text-center"
                >
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const yearsList = [];
                    for (let y = currentYear - 100; y <= currentYear + 3; y++) {
                      yearsList.push(y);
                    }
                    return yearsList.reverse().map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Weekdays Header */}
              {weekdays.map((day) => (
                <span key={day} className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider py-1">
                  {day}
                </span>
              ))}

              {/* Leading days (previous month) */}
              {leadingDays.map((day, idx) => {
                const disabled = isDayDisabled(day, -1);
                return (
                  <button
                    key={`lead-${idx}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelectDay(day, -1)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all text-slate-300",
                      disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                    )}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Current month days */}
              {currentDays.map((day) => {
                const selected = isDaySelected(day);
                const today = isDayToday(day);
                const disabled = isDayDisabled(day, 0);
                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelectDay(day, 0)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all",
                      selected && "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.15)]",
                      today && !selected && "border border-[#2563EB]/45 text-[#2563EB]",
                      !selected && !today && "text-slate-700 hover:bg-slate-50",
                      disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Trailing days (next month) */}
              {trailingDays.map((day, idx) => {
                const disabled = isDayDisabled(day, 1);
                return (
                  <button
                    key={`trail-${idx}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelectDay(day, 1)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all text-slate-300",
                      disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
