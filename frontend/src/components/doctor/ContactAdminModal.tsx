import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  setMessage: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  success: string | null;
}

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  message,
  setMessage,
  onSubmit,
  submitting,
  error,
  success,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg sm:rounded-3xl p-6 md:p-8">
        <DialogHeader className="border-b border-slate-100 pb-4 text-left sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#2563EB]/10 rounded-2xl text-[#2563EB]">
              <HelpCircle size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#0F172A]">
                Contact Administration
              </DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">
                Direct inquiry to hospital administration
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <Badge variant="destructive" className="w-full justify-start p-3 text-xs rounded-xl font-semibold">
            {error}
          </Badge>
        )}

        {success && (
          <Badge variant="success" className="w-full justify-start p-3 text-xs rounded-xl font-semibold">
            {success}
          </Badge>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">
              Message to Administrative Office
            </label>
            <textarea
              rows={5}
              placeholder="Describe your schedule change request, facility issue, or administrative query..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all leading-relaxed"
              required
            />
          </div>

          <DialogFooter className="pt-2 flex sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 rounded-xl px-5 py-2.5 font-semibold text-xs cursor-pointer"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={submitting || !message.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-6 py-2.5 font-semibold text-xs shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
