import React from "react";
import { ClipboardList, Heart, Plus, Trash, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import type { PrescriptionItem } from "../../types";

interface ConsultationPanelProps {
  consultingSlot: any;
  consultingPatient: any;
  diagnosis: string;
  setDiagnosis: (val: string) => void;
  prescriptions: PrescriptionItem[];
  handleAddPrescriptionLine: () => void;
  handleRemovePrescriptionLine: (index: number) => void;
  handlePrescriptionChange: (index: number, field: string, value: string) => void;
  handleSubmitConsultation: (e: React.FormEvent) => void;
  submittingConsultation: boolean;
  onClose: () => void;
}

export const ConsultationPanel: React.FC<ConsultationPanelProps> = ({
  consultingSlot,
  consultingPatient,
  diagnosis,
  setDiagnosis,
  prescriptions,
  handleAddPrescriptionLine,
  handleRemovePrescriptionLine,
  handlePrescriptionChange,
  handleSubmitConsultation,
  submittingConsultation,
  onClose,
}) => {
  const isOpen = Boolean(consultingSlot && consultingPatient);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-3xl p-6 md:p-8">
        <DialogHeader className="border-b border-slate-100 pb-4 text-left sm:text-left">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">
            Clinical Consultation
          </DialogTitle>
          <DialogDescription className="text-sm text-[#64748B] mt-1 flex flex-wrap items-center gap-2">
            <span>
              Patient:{" "}
              <span className="font-bold text-[#0F172A]">
                {consultingPatient?.patientId?.fullName || "Patient"}
              </span>
            </span>
            {consultingSlot && (
              <Badge variant="outline" className="font-normal text-xs">
                {new Date(consultingSlot.date).toLocaleDateString()} at{" "}
                {formatTimeInterval(consultingSlot.time, consultingSlot.duration)}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitConsultation} className="space-y-6">
          {/* Patient-reported context — read-only */}
          {(consultingPatient?.symptoms || consultingSlot?.notes) && (
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                Patient-Reported Information
              </Badge>
              {consultingPatient?.symptoms && (
                <div>
                  <span className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Reported Symptoms:
                  </span>
                  <p className="text-xs text-[#64748B] bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {consultingPatient.symptoms}
                  </p>
                </div>
              )}
              {consultingSlot?.notes && (
                <div>
                  <span className="text-xs font-semibold text-[#0F172A] block mb-1">
                    Slot Notes:
                  </span>
                  <p className="text-xs text-[#64748B] bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {consultingSlot.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="diagnosis"
              className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5"
            >
              <ClipboardList size={16} className="text-[#2563EB]" />
              Clinical Diagnosis & Observations <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="diagnosis"
              rows={3}
              placeholder="Write clinical findings, diagnosis, and observations here..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Heart size={16} className="text-[#2563EB]" />
                Prescribed Medications
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPrescriptionLine}
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Plus size={12} />
                <span>Add Medication</span>
              </Button>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {prescriptions.map((rxLine, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 relative"
                >
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[10px] font-bold text-[#64748B] uppercase">
                      Medication Name
                    </Label>
                    <Input
                      placeholder="Medication Name"
                      value={rxLine.medication}
                      onChange={(e) =>
                        handlePrescriptionChange(idx, "medication", e.target.value)
                      }
                      className="rounded-lg border-[#E2E8F0] bg-white focus:border-[#2563EB] text-xs py-1"
                      required={idx === 0}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#64748B] uppercase">
                      Dosage
                    </Label>
                    <Input
                      placeholder="e.g. 500mg"
                      value={rxLine.dosage}
                      onChange={(e) =>
                        handlePrescriptionChange(idx, "dosage", e.target.value)
                      }
                      className="rounded-lg border-[#E2E8F0] bg-white focus:border-[#2563EB] text-xs py-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#64748B] uppercase">
                      Frequency
                    </Label>
                    <Input
                      placeholder="e.g. Twice daily"
                      value={rxLine.frequency}
                      onChange={(e) =>
                        handlePrescriptionChange(idx, "frequency", e.target.value)
                      }
                      className="rounded-lg border-[#E2E8F0] bg-white focus:border-[#2563EB] text-xs py-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#64748B] uppercase">
                      Duration
                    </Label>
                    <Input
                      placeholder="e.g. 7 days"
                      value={rxLine.duration}
                      onChange={(e) =>
                        handlePrescriptionChange(idx, "duration", e.target.value)
                      }
                      className="rounded-lg border-[#E2E8F0] bg-white focus:border-[#2563EB] text-xs py-1"
                    />
                  </div>

                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescriptionLine(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded-full border border-red-200 transition-all cursor-pointer"
                    >
                      <Trash size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4 flex sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 rounded-xl px-5 py-2.5 font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingConsultation}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-6 py-2.5 font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {submittingConsultation ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  <span>Complete & Save Consultation</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
