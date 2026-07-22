import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, UserPlus, LogIn, Shield, Menu, X, HeartPulse } from "lucide-react";
import AppLogo from "../assets/app-logo-transparent.png";
import { useState } from "react";
import { ModalProvider } from "../contexts/ModalContext";

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Doctor, patient, and admin portals own their full-screen layout.
  // The global header is only shown for auth pages and guests.
  const isPortalUser =
    isAuthenticated &&
    (user?.role === "doctor" || user?.role === "patient" || user?.role === "admin");

  return (
    <ModalProvider>
      <div
        className={`flex flex-col bg-[#F8FAFC] ${
          isPortalUser ? "h-screen overflow-hidden" : "min-h-screen"
        }`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2563EB] focus:text-white focus:font-bold focus:rounded-xl shadow-md outline-none"
        >
          Skip to main content
        </a>
        {!isPortalUser && (
          <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.015)] transition-all duration-300">
            <div className="w-full h-full px-6 flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="p-1 bg-[#2563EB]/8 rounded-lg flex items-center justify-center shadow-sm">
                  <img
                    src={AppLogo}
                    alt="Salamat Hospital Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <Link
                  to={isAuthenticated ? (user?.role === "admin" ? "/app/admin" : "/app") : "/"}
                  className="text-xl font-black text-[#0F172A] tracking-tight hover:text-[#2563EB] transition-colors"
                >
                  Salamat
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500">
                <a href="/#home" className="hover:text-[#2563EB] transition-colors">
                  Home
                </a>
                <a href="/#achievements" className="hover:text-[#2563EB] transition-colors">
                  Achievements
                </a>
                <a href="/#testimonials" className="hover:text-[#2563EB] transition-colors">
                  Testimonials
                </a>
                <a href="/#emergency" className="hover:text-[#2563EB] hover:scale-105 active:scale-95 transition-all text-[#DC2626] flex items-center gap-1 font-extrabold">
                  <HeartPulse size={14} className="animate-pulse" />
                  <span>Emergency</span>
                </a>
                <a href="/#contact" className="hover:text-[#2563EB] transition-colors">
                  Contact
                </a>

                {/* Auth Controls */}
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                      {user.role}
                    </span>
                    {user.role === "admin" && (
                      <Link
                        to="/app/admin"
                        className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-all mr-2"
                      >
                        <Shield size={14} className="text-[#2563EB]" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <Link
                      to="/app/login"
                      className="text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/app/signup"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </nav>

              {/* Mobile hamburger menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-900 focus:outline-none cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg px-6 py-4 flex flex-col gap-4 z-50">
                <a
                  href="/#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 hover:text-[#2563EB]"
                >
                  Home
                </a>
                <a
                  href="/#achievements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 hover:text-[#2563EB]"
                >
                  Achievements
                </a>
                <a
                  href="/#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 hover:text-[#2563EB]"
                >
                  Testimonials
                </a>
                <a
                  href="/#emergency"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-black text-red-500 hover:text-red-700 flex items-center gap-1.5"
                >
                  <HeartPulse size={16} className="animate-pulse" />
                  <span>Emergency Hotline</span>
                </a>
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 hover:text-[#2563EB]"
                >
                  Contact Us
                </a>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Role:</span>
                      <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>
                    {user?.role === "admin" && (
                      <Link
                        to="/app/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#2563EB]"
                      >
                        <Shield size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 w-full text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                    <Link
                      to="/app/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-2.5"
                    >
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/app/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-[#2563EB] text-white rounded-xl py-2.5 shadow-md transition-all duration-200"
                    >
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </header>
        )}

        {isAuthenticated && user && user.isVerified === false && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs font-bold text-amber-700 text-center flex items-center justify-center gap-2 shrink-0 animate-pulse">
            <span>⚠ Please verify your email address to secure your account.</span>
            <Link to="/app/verify-email" className="underline text-[#2563EB] hover:text-[#1D4ED8] font-bold">
              Enter Verification Code
            </Link>
          </div>
        )}

        <main id="main-content" className={`flex flex-col ${isPortalUser ? "flex-1 overflow-hidden" : "flex-grow"}`}>
          <Outlet />
        </main>
      </div>
    </ModalProvider>
  );
}
