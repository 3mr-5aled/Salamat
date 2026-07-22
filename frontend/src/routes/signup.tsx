import React from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  ChevronDown,
  Award,
  Clock
} from "lucide-react";
import { rootRoute } from "./__root";
import AppLogo from "../assets/app-logo-transparent.png";
import { motion } from "framer-motion";

const signupSchema = zod
  .object({
    fullName: zod.string().min(3, "Full name must be at least 3 characters"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod.string(),
    role: zod.enum(["patient", "doctor"]),
    specialization: zod.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "doctor" && (!data.specialization || data.specialization.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Specialization is required for doctors",
    path: ["specialization"],
  });

type SignupSchema = zod.infer<typeof signupSchema>;

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/signup",
  component: SignupComponent,
});

function SignupComponent() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "patient", specialization: "" },
  });

  const selectedRole = watch("role");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/app" });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignupSchema) => {
    try {
      setError(null);
      const signupArgs: [string, string, string, string, string, string?] = [
        data.fullName,
        data.email,
        data.password,
        data.confirmPassword,
        data.role,
      ];
      if (data.role === "doctor" && data.specialization) {
        signupArgs.push(data.specialization);
      }
      await signup(...signupArgs);
      if (data.role === "doctor") {
        navigate({ to: "/app/waiting-for-verification" });
      } else {
        navigate({ to: "/app" });
      }
    } catch (err: any) {
      if (err?.response?.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
          setError(err.response.data.errors.map((e: any) => e.msg).join(", "));
        } else {
          setError("Sign up failed. Please try again.");
        }
      } else {
        setError("Sign up failed. Please try again.");
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
            Create an Account in <span className="text-[#14B8A6]">Salamat</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
            Join our modern healthcare network. Connect with board-certified doctor consultants, manage appointments, and track your clinical prescriptions instantly.
          </p>

          {/* Quick Features List */}
          <div className="space-y-4 pt-6 border-t border-white/10 max-w-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                <User size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Dedicated Patients Portal & Dashboard</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2563EB] shrink-0">
                <Award size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Custom Doctor Scheduling & Prescriptions</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                <Clock size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-200">24/7 Digital Support & Fast Verifications</span>
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
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Create an Account</h1>
            <p className="text-xs text-[#64748B] font-semibold">
              Register to schedule appointments and connect with doctors
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {error && (
              <div className="rounded-xl bg-[#DC2626]/5 p-3.5 text-xs font-bold text-[#DC2626] border border-[#DC2626]/10 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Hidden role input for react-hook-form schema compatibility */}
            <input type="hidden" {...register("role")} />

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs font-semibold placeholder:text-slate-400 placeholder:font-medium transition-colors"
                  {...register("fullName")}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={12} />
                  <span>{errors.fullName.message}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs font-semibold placeholder:text-slate-400 placeholder:font-medium transition-colors"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={12} />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </Label>
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs font-semibold placeholder:text-slate-400 placeholder:font-medium transition-colors"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={12} />
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            {/* Role Select Button Tabs */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sign Up As</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValue("role", "patient");
                    setValue("specialization", "");
                  }}
                  className={`h-11 rounded-xl font-bold text-xs cursor-pointer border flex items-center justify-center gap-2 transition-all duration-200 ${
                    selectedRole === "patient"
                      ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                      : "bg-white border-slate-200 text-[#64748B] hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <User size={14} />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "doctor")}
                  className={`h-11 rounded-xl font-bold text-xs cursor-pointer border flex items-center justify-center gap-2 transition-all duration-200 ${
                    selectedRole === "doctor"
                      ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                      : "bg-white border-slate-200 text-[#64748B] hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <Award size={14} />
                  <span>Doctor</span>
                </button>
              </div>
            </div>

            {/* Specialization (only for doctors) - smooth slide animation */}
            {selectedRole === "doctor" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5 overflow-hidden"
              >
                <Label htmlFor="specialization" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Specialization
                </Label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    id="specialization"
                    className="w-full pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs py-2.5 focus:border-[#2563EB] outline-none appearance-none cursor-pointer text-[#0F172A] font-semibold h-11"
                    {...register("specialization")}
                  >
                    <option value="">Select Specialty</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="ENT (Otolaryngology)">ENT (Otolaryngology)</option>
                    <option value="Dental">Dental</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                {errors.specialization && (
                  <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1.5 font-bold">
                    <AlertCircle size={12} />
                    <span>{errors.specialization.message}</span>
                  </p>
                )}
              </motion.div>
            )}

            <Button
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Creating Account..." : "Sign Up"}</span>
              {!isSubmitting && <UserPlus size={16} />}
            </Button>
          </form>

          {/* Signin redirection */}
          <div className="text-xs text-center text-[#64748B] pt-4 border-t border-slate-100 font-semibold">
            Already have an account?{" "}
            <Link to="/app/login" className="text-[#2563EB] font-black hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
