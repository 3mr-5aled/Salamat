import React from "react";
import { Calendar, Clock, Award } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { formatTimeInterval } from "../../lib/formatters";

interface BookingConfirmModalProps {
  bookingSlot: any | null;
  onClose: () => void;
  selectedDoc: any | null;
  symptoms: string;
  setSymptoms: (val: string) => void;
  handleBook: (slotId: string) => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  bookingSlot,
  onClose,
  selectedDoc,
  symptoms,
  setSymptoms,
  handleBook,
}) => {
  const isOpen = Boolean(bookingSlot);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md sm:rounded-3xl p-6 md:p-8 space-y-5">
        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">
            Confirm Booking Request
          </DialogTitle>
          <DialogDescription className="text-xs text-[#64748B] mt-1.5">
            You are requesting an appointment with{" "}
            <span className="font-bold text-[#2563EB]">
              {selectedDoc?.fullName || selectedDoc?.user?.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {bookingSlot && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#0F172A] font-bold">
                <Calendar size={14} className="text-[#2563EB]" />
                <span>{new Date(bookingSlot.date).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="text-[10px]">Vacant Slot</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Clock size={14} className="text-[#2563EB]" />
              <span>{formatTimeInterval(bookingSlot.time, bookingSlot.duration)}</span>
            </div>
            {bookingSlot.clinic && (
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Award size={14} className="text-[#2563EB]" />
                <span>{bookingSlot.clinic.name}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="modal-symptoms" className="text-xs font-bold text-[#0F172A]">
            Describe Symptoms
          </Label>
          <textarea
            id="modal-symptoms"
            rows={3}
            placeholder="Describe symptoms, medical history, or reason for appointment..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
          />
        </div>

        <DialogFooter className="flex sm:justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => bookingSlot && handleBook(bookingSlot._id)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-5 py-2 text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-all cursor-pointer"
          >
            Confirm Appointment Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
