import React, { useState } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { verifyEmail, resendVerification } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { rootRoute } from "./__root";
import { ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/verify-email",
  component: VerifyEmailComponent,
});

function VerifyEmailComponent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError("Verification code must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await verifyEmail(code.trim(), user?.email);
      setSuccess("Account verified successfully! Redirecting you...");
      setTimeout(() => {
        // Refresh local storage and user info
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.isVerified = true;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        navigate({ to: "/app" });
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      setSuccess(null);
      await resendVerification();
      setSuccess("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend code. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <Card className="max-w-md w-full rounded-3xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
        <form onSubmit={handleVerify}>
          <CardHeader className="space-y-1.5 px-8 pt-8">
            <CardTitle className="text-2xl font-black text-[#0F172A]">Verify Your Account</CardTitle>
            <CardDescription className="text-xs text-[#64748B] font-medium leading-relaxed">
              We have sent a 6-digit verification code to your registered email address {user?.email && `(${user.email})`}. Please enter the code below to verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-8 py-4">
            {error && (
              <div className="rounded-xl bg-[#DC2626]/5 p-4 text-xs font-semibold text-[#DC2626] border border-[#DC2626]/10 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-[#16A34A]/5 p-4 text-xs font-semibold text-[#16A34A] border border-[#16A34A]/10 flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-bold text-[#0F172A]">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="rounded-xl border-slate-200 text-xs py-2.5"
                required
                disabled={loading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
            <Button
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl py-2.5 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
              type="submit"
              disabled={loading || code.trim().length !== 6}
            >
              <ShieldCheck size={14} />
              <span>{loading ? "Verifying..." : "Verify Account"}</span>
            </Button>

            <div className="flex justify-between items-center w-full text-xs">
              <Link
                to="/app/login"
                className="text-[#64748B] hover:text-[#0F172A] font-bold flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                <span>Back to Login</span>
              </Link>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#2563EB] hover:underline font-bold cursor-pointer disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend Code"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
