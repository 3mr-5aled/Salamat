import React, { useState } from "react";
import api from "../../services/api";
import { Button } from "../ui/button";
import { Sparkles, Check, AlertCircle, Loader2 } from "lucide-react";
import type { PrescriptionItem } from "../../types";

interface AIConsultationHelperProps {
  onApply: (diagnosis: string, prescriptions: PrescriptionItem[]) => void;
}

export const AIConsultationHelper: React.FC<AIConsultationHelperProps> = ({ onApply }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    soapNotes: string;
    prescriptions: PrescriptionItem[];
  } | null>(null);
  const [applied, setApplied] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError("Please enter some unstructured clinical notes first.");
      return;
    }

    setLoading(true);
    setError(null);
    setApplied(false);

    try {
      const response = await api.post("/ai/summarize", { notes: notes.trim() });
      
      // Support both { status: "success", data: { soapNotes, prescriptions } } and { soapNotes, prescriptions }
      const data = response.data?.data || response.data;
      
      if (data && (data.soapNotes || data.prescriptions)) {
        setResult({
          soapNotes: data.soapNotes || "",
          prescriptions: data.prescriptions || [],
        });
      } else {
        throw new Error("Invalid response format from AI service");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to AI summarizer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result.soapNotes, result.prescriptions);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-4 space-y-4 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 border-b border-blue-100/55 pb-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Sparkles size={16} className="animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">AI Consultation Co-Pilot</h4>
          <p className="text-[11px] text-[#64748B]">
            Type or paste unstructured notes to auto-format SOAP notes and prescriptions.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          rows={3}
          placeholder="e.g. patient has severe eczema. prescribed hydrocortisone cream 1% twice daily for 7 days. follow up in 2 weeks."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-[#94A3B8]"
        />
        
        {error && (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded-lg text-xs font-medium border border-red-100">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(37,99,235,0.15)] disabled:opacity-70 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Formatting notes...</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>AI Format & Generate SOAP Notes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-3 border-t border-blue-100/50 pt-3 space-y-3 bg-white/60 rounded-xl p-3 border border-white">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Generated SOAP Notes
            </span>
            <div className="text-xs text-[#334155] whitespace-pre-wrap bg-white/80 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-mono max-h-[150px] overflow-y-auto">
              {result.soapNotes}
            </div>
          </div>

          {result.prescriptions && result.prescriptions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Structured Prescriptions
              </span>
              <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white/80">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-[#64748B] uppercase">
                      <th className="p-2">Medication</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Freq</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-[#334155]">
                    {result.prescriptions.map((rx, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-b-0">
                        <td className="p-2 font-medium">{rx.medication || "-"}</td>
                        <td className="p-2">{rx.dosage || "-"}</td>
                        <td className="p-2">{rx.frequency || "-"}</td>
                        <td className="p-2">{rx.duration || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(16,185,129,0.15)] transition-all cursor-pointer"
            >
              {applied ? (
                <>
                  <Check size={12} />
                  <span>Applied Successfully!</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>Use AI Recommendation</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
