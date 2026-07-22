import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Heart, FileText } from "lucide-react";

interface PrescriptionModalProps {
  viewingPrescription: any | null;
  onClose: () => void;
  patientName?: string;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  viewingPrescription,
  onClose,
  patientName = "Patient",
}) => {
  const isOpen = Boolean(viewingPrescription);

  let dx = "";
  let rx: any[] = [];
  if (viewingPrescription?.notes) {
    try {
      const parsed = JSON.parse(viewingPrescription.notes);
      dx = parsed.dx || "";
      rx = Array.isArray(parsed.rx) ? parsed.rx : [];
    } catch (e) {
      dx = viewingPrescription.notes;
    }
  }

  const handlePrint = () => {
    const printContents = document.getElementById("prescription-print-content")?.innerHTML;
    if (printContents) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Prescription Card</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0F172A; }
                .text-center { text-align: center; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .grid { display: grid; }
                .grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr; }
                .gap-3 { gap: 12px; }
                .border-b { border-bottom: 1px solid #E2E8F0; }
                .border-t { border-top: 1px solid #E2E8F0; }
                .pb-5 { padding-bottom: 20px; }
                .pt-6 { padding-top: 24px; }
                .space-y-6 > * + * { margin-top: 24px; }
                .space-y-3 > * + * { margin-top: 12px; }
                .bg-slate-50 { background-color: #F8FAFC; }
                .p-4 { padding: 16px; }
                .rounded-2xl { border-radius: 16px; }
                .border { border: 1px solid #E2E8F0; }
                .text-xs { font-size: 12px; }
                .text-sm { font-size: 14px; }
                .text-xl { font-size: 20px; }
                .font-bold { font-weight: 700; }
                .uppercase { text-transform: uppercase; }
                .text-right { text-align: right; }
                .text-slate-400 { color: #94A3B8; }
                .text-slate-700 { color: #334155; }
                .text-slate-800 { color: #1E293B; }
                .text-blue-600 { color: #2563EB; }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                th, td { padding: 10px 12px; border-bottom: 1px solid #F1F5F9; text-align: left; font-size: 12px; }
                th { background-color: #F8FAFC; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="space-y-6">${printContents}</div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl sm:rounded-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="bg-slate-50 px-6 py-5 border-b border-slate-100 text-left sm:text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="text-[#2563EB]" size={22} />
              <DialogTitle className="text-lg font-bold text-[#0F172A]">
                Medical Prescription Card
              </DialogTitle>
            </div>
            <Badge variant="success" className="text-[10px]">Verified Digital Record</Badge>
          </div>
        </DialogHeader>

        {viewingPrescription && (
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1" id="prescription-print-content">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-5">
              <div>
                <h4 className="font-bold text-xl text-[#0F172A]">SALAMAT CARE CLINICS</h4>
                <p className="text-xs text-[#64748B]">{viewingPrescription.clinic?.name || "Main Health Branch"}</p>
                <p className="text-xs text-[#64748B]">{viewingPrescription.clinic?.location || "Cairo, Egypt"}</p>
              </div>
              <div className="text-left sm:text-right">
                <h5 className="font-bold text-base text-[#2563EB]">{viewingPrescription.doctor?.fullName || "Doctor Specialist"}</h5>
                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">{viewingPrescription.doctor?.specialization || "Specialist"}</p>
                <p className="text-xs text-[#64748B]">Date: {new Date(viewingPrescription.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] uppercase font-bold text-[9px] block">Patient Name</span>
                <span className="font-bold text-sm text-[#0F172A]">{patientName}</span>
              </div>
              <div>
                <span className="text-[#64748B] uppercase font-bold text-[9px] block">Age & Gender</span>
                <span className="font-semibold text-slate-700">Adult</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Clinical Diagnosis</h5>
              <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                {dx || "Routine checkup and general consultation."}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                <span>Rx</span>
                <span className="text-[10px] text-[#64748B] lowercase italic font-normal">(prescribed medications)</span>
              </h5>

              {rx.length > 0 ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[#0F172A] font-bold">
                        <th className="px-4 py-3">Medication</th>
                        <th className="px-4 py-3">Dosage</th>
                        <th className="px-4 py-3">Frequency</th>
                        <th className="px-4 py-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {rx.map((med: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-[#0F172A]">{med.m}</td>
                          <td className="px-4 py-3">{med.d}</td>
                          <td className="px-4 py-3 font-medium text-[#2563EB]">{med.f}</td>
                          <td className="px-4 py-3">{med.t}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#64748B] italic">No medication prescribed during this visit.</p>
              )}
            </div>

            <div className="text-center pt-6 border-t border-slate-100 text-[10px] text-[#64748B] space-y-1 leading-snug">
              <p className="font-semibold text-[#0F172A]">This is an official digital clinical prescription from Salamat Care Portal.</p>
              <p>Computer-generated and authenticated. No physical signature required.</p>
            </div>
          </div>
        )}

        <DialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex sm:justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-5 py-2 text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.15)] cursor-pointer flex items-center gap-1.5"
          >
            <FileText size={14} />
            <span>Print Prescription</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
