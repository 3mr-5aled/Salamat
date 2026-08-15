import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  ClipboardList,
  HelpCircle,
  LogOut,
  User,
  ChevronUp,
  Settings,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import type { DoctorTab } from "../../hooks/useDoctorDashboard";
import AppLogo from "../../assets/app-logo-transparent.png";

import { NotificationBell } from "../NotificationBell";

interface DoctorSidebarProps {
  activeTab: DoctorTab;
  setActiveTab: (tab: DoctorTab) => void;
  onContactAdminClick: () => void;
}

const NAV_ITEMS: { tab: DoctorTab; icon: React.ReactNode; label: string; mobileLabel: string }[] = [
  { tab: "overview",  icon: <LayoutDashboard size={18} />, label: "Overview",            mobileLabel: "Overview" },
  { tab: "bookings",  icon: <Calendar size={18} />,        label: "Patient Visits",       mobileLabel: "Visits"   },
  { tab: "slots",     icon: <Clock size={18} />,           label: "Consultation Hours",   mobileLabel: "Hours"    },
  { tab: "patients",  icon: <ClipboardList size={18} />,   label: "My Patients",          mobileLabel: "Patients" },
];

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeTab,
  setActiveTab,
  onContactAdminClick,
}) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const initials = (user?.fullName || user?.name)
    ? (user?.fullName || user?.name).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col hidden md:flex shrink-0">

        {/* Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-[#2563EB]/8 rounded-lg flex items-center justify-center">
              <img src={AppLogo} alt="Salamat Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <div className="text-base font-black text-[#0F172A] tracking-tight leading-tight">Salamat</div>
              <div className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-widest">Doctor Portal</div>
            </div>
          </div>
          <NotificationBell align="left" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-5">
          {NAV_ITEMS.map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full text-left ${
                activeTab === tab
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={onContactAdminClick}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] w-full text-left cursor-pointer"
          >
            <HelpCircle size={18} />
            <span>Contact Admin</span>
          </button>
        </nav>

        {/* Profile Button + Popover */}
        <div className="px-3 pb-4 relative" ref={popoverRef}>
          {/* Sign-out popover */}
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-black shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0F172A] truncate">{user?.fullName || user?.name}</div>
                    <div className="text-xs text-[#64748B] truncate">{user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all cursor-pointer"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={15} />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#DC2626] hover:bg-red-50 transition-all cursor-pointer w-full text-left"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile trigger button */}
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
              profileOpen
                ? "border-[#2563EB]/30 bg-[#2563EB]/5"
                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-bold text-[#0F172A] truncate">{user?.fullName || user?.name}</div>
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Doctor</div>
            </div>
            <ChevronUp
              size={16}
              className={`text-[#64748B] transition-transform duration-200 shrink-0 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        {NAV_ITEMS.map(({ tab, icon, mobileLabel }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-all duration-200 cursor-pointer ${
              activeTab === tab ? "text-[#2563EB]" : "text-[#64748B]"
            }`}
          >
            {icon}
            <span className="text-[10px] font-semibold">{mobileLabel}</span>
          </button>
        ))}
        {/* Profile button on mobile */}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center gap-1 w-20 h-full transition-all duration-200 cursor-pointer text-[#64748B] hover:text-[#DC2626]"
        >
          <User size={18} />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </nav>
    </>
  );
};
