import React from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Lock, ArrowRight, AlertCircle, Phone, Activity, Clock, FileText } from "lucide-react";
import { rootRoute } from "./__root";
import AppLogo from "../assets/app-logo-transparent.png";
import { motion } from "framer-motion";

const loginSchema = zod.object({
  identifier: zod.string()
    .min(1, "Email or phone number is required")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^01[0125]\d{8}$/.test(val.replace(/^(\+2|002)/, "").replace(/\s/g, ""));
        return isEmail || isPhone;
      },
      { message: "Must be a valid email or Egyptian phone number (e.g. 01012345678)" }
    ),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = zod.infer<typeof loginSchema>;

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/login",
  component: LoginComponent,
});

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate({ to: "/app/admin" });
      } else if (user?.role === "doctor" && user?.isActive !== true) {
        navigate({ to: "/app/waiting-for-verification" });
      } else {
        navigate({ to: "/app" });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginSchema) => {
    try {
      setError(null);
      await login(data.identifier, data.password);
      
      const storedUser = localStorage.getItem("user");
      const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
      
      if (loggedInUser?.role === "admin") {
        navigate({ to: "/app/admin" });
      } else if (loggedInUser?.role === "doctor" && loggedInUser?.isActive !== true) {
        navigate({ to: "/app/waiting-for-verification" });
      } else {
        navigate({ to: "/app" });
      }
    } catch (err: any) {
      if (err?.response?.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (
          Array.isArray(err.response.data.errors) &&
          err.response.data.errors.length > 0
        ) {
          setError(err.response.data.errors.map((e: any) => e.msg).join(", "));
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="flex-grow w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* Left Pane: Visual Info Hub (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Particle blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.2),transparent_50%)] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md">
            <img src={AppLogo} alt="Salamat Hospital Logo" className="h-7 w-auto object-contain brightness-0 invert" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase text-slate-200">Salamat Hub</span>
        </div>

        {/* Middle Content */}
        <div className="space-y-8 relative z-10 my-auto">
          <h2 className="text-4xl font-black leading-tight tracking-tight text-white">
            Salamatk is our <span className="text-[#14B8A6]">Responsibility</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
            Access board-certified consultant specialists, schedule appointments in real-time, and manage digital medical records securely.
          </p>

          {/* Quick Stats list */}
          <div className="space-y-4 pt-6 border-t border-white/10 max-w-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                <Activity size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Unified Medical Consultation Profiles</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2563EB] shrink-0">
                <Clock size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Real-Time Available Consultation Slots</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                <FileText size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Instant Access to Prescriptions & Diagnosis</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">
          &copy; {new Date().getFullYear()} Salamat Hospital. Safe & Accredited.
        </div>
      </div>

      {/* Right Pane: Form container */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.025)] p-8 sm:p-10 space-y-6"
        >
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 lg:hidden mb-4">
              <div className="p-1.5 bg-[#2563EB]/8 rounded-xl flex items-center justify-center shadow-sm">
                <img src={AppLogo} alt="Salamat Hospital Logo" className="h-8 w-auto object-contain" />
              </div>
              <span className="text-base font-black text-[#0F172A] tracking-tight uppercase">Salamat</span>
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-[#64748B] font-semibold">
              Enter your credentials to manage appointments and records
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {error && (
              <div className="rounded-xl bg-[#DC2626]/5 p-3.5 text-xs font-bold text-[#DC2626] border border-[#DC2626]/10 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Email/Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email or Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="m@example.com or 01012345678"
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs font-semibold placeholder:text-slate-400 placeholder:font-medium transition-colors"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={12} />
                  <span>{errors.identifier.message}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </Label>
                <Link to="/app/forgot-password" className="text-xs text-[#2563EB] font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs font-semibold placeholder:text-slate-400 placeholder:font-medium transition-colors"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={12} />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <Button
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </Button>
          </form>

          {/* Signup redirection */}
          <div className="text-xs text-center text-[#64748B] pt-4 border-t border-slate-100 font-semibold">
            Don't have an account?{" "}
            <Link to="/app/signup" className="text-[#2563EB] font-black hover:underline ml-1">
              Register here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
