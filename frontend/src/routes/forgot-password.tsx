import React, { useState } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { forgotPassword, verifyResetCode, resetPassword } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { rootRoute } from "./__root";
import { Mail, ShieldCheck, Lock, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/forgot-password",
  component: ForgotPasswordComponent,
});

function ForgotPasswordComponent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await forgotPassword(email.trim());
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send reset code. Please verify your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError("Reset code must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await verifyResetCode(code.trim());
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await resetPassword(email.trim(), password, confirmPassword);
      // Auto login user on successful reset
      await login(email.trim(), password);
      setStep(4);
    } catch (err: any) {
      setError(err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <Card className="max-w-md w-full rounded-3xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <CardHeader className="space-y-1.5 px-8 pt-8">
              <CardTitle className="text-2xl font-black text-[#0F172A]">Forgot Password?</CardTitle>
              <CardDescription className="text-xs text-[#64748B] font-medium leading-relaxed">
                Enter your email address and we will send you a 6-digit confirmation code to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-8 py-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-[#DC2626] text-xs p-3.5 rounded-2xl font-medium">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-[#0F172A]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Sending..." : "Send Reset Code"}</span>
                {!loading && <ArrowRight size={16} />}
              </Button>
              <Link to="/app/login" className="flex items-center gap-1.5 text-xs text-[#64748B] font-bold hover:text-[#0F172A] transition-all justify-center">
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <CardHeader className="space-y-1.5 px-8 pt-8">
              <CardTitle className="text-2xl font-black text-[#0F172A]">Verify Reset Code</CardTitle>
              <CardDescription className="text-xs text-[#64748B] font-medium leading-relaxed">
                We sent a 6-digit verification code to <span className="font-bold text-[#0F172A]">{email}</span>. Enter it below to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-8 py-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-[#DC2626] text-xs p-3.5 rounded-2xl font-medium">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs font-bold text-[#0F172A]">6-Digit Code</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="code"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2 tracking-widest font-black"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Verifying..." : "Verify Code"}</span>
                {!loading && <ArrowRight size={16} />}
              </Button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="text-xs text-[#2563EB] font-bold hover:underline cursor-pointer transition-all mx-auto"
              >
                Resend Code
              </button>
            </CardFooter>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <CardHeader className="space-y-1.5 px-8 pt-8">
              <CardTitle className="text-2xl font-black text-[#0F172A]">New Password</CardTitle>
              <CardDescription className="text-xs text-[#64748B] font-medium leading-relaxed">
                Choose a secure password. Must be at least 6 characters and contain an uppercase letter, lowercase letter, and a number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-8 py-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-[#DC2626] text-xs p-3.5 rounded-2xl font-medium">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-bold text-[#0F172A]">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs font-bold text-[#0F172A]">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm py-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Resetting..." : "Reset & Sign In"}</span>
                {!loading && <ArrowRight size={16} />}
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 4 && (
          <div className="px-8 py-10 flex flex-col items-center justify-center text-center space-y-5">
            <div className="p-3 bg-[#10B981]/10 rounded-full text-[#10B981] animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#0F172A]">Password Reset Done</h3>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed max-w-[280px]">
                Your password has been successfully updated and you are now securely signed in.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: "/app" })}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-semibold transition-all cursor-pointer"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
