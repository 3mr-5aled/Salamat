import React, { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, RefreshCw, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { summarizeNotes } from "../../services/ai";
import type { SummarizeResult } from "../../services/ai";
import { getFriendlyAIErrorMessage } from "../../lib/error-parser";

interface AIConsultationHelperProps {
  rawNotes: string;
  onApply: (soapFormattedText: string) => void;
}

export const AIConsultationHelper: React.FC<AIConsultationHelperProps> = ({ rawNotes, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<SummarizeResult | null>(null);

  const handleStructure = async () => {
    if (!rawNotes.trim() || rawNotes.trim().length < 10) return;
    setLoading(true);
    setError(null);

    try {
      const res = await summarizeNotes(rawNotes.trim());
      setPreview(res);
    } catch (err: any) {
      setError(getFriendlyAIErrorMessage(err, "summarize"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApply = () => {
    if (!preview) return;
    const soapText = [
      `Subjective: ${preview.soap.subjective}`,
      `Objective: ${preview.soap.objective}`,
      `Assessment: ${preview.soap.assessment}`,
      `Plan: ${preview.soap.plan}`,
    ].join("\n\n");

    onApply(soapText);
    setPreview(null);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {rawNotes.trim().length < 10 ? "Min 10 chars to structure with AI" : "AI Assistant ready"}
        </span>
        <Button
          type="button"
          onClick={handleStructure}
          disabled={loading || rawNotes.trim().length < 10}
          size="sm"
          className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Structuring...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>Structure with AI</span>
            </>
          )}
        </Button>
      </div>

      {/* Inline Error State */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStructure}
            className="h-7 px-2.5 text-xs border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1"
          >
            <RefreshCw size={11} />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* SOAP Preview Card */}
      {preview && (
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-4 space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>SOAP Note AI Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => setPreview(null)}
                className="h-7 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <X size={13} />
                <span>Discard</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmApply}
                className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Check size={13} />
                <span>Apply SOAP Note</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs font-medium">
            <div className="p-2.5 bg-slate-800/60 rounded-xl">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">Subjective</span>
              <p className="text-slate-200 leading-relaxed">{preview.soap.subjective}</p>
            </div>
            <div className="p-2.5 bg-slate-800/60 rounded-xl">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">Objective</span>
              <p className="text-slate-200 leading-relaxed">{preview.soap.objective}</p>
            </div>
            <div className="p-2.5 bg-slate-800/60 rounded-xl">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">Assessment</span>
              <p className="text-slate-200 leading-relaxed">{preview.soap.assessment}</p>
            </div>
            <div className="p-2.5 bg-slate-800/60 rounded-xl">
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">Plan</span>
              <p className="text-slate-200 leading-relaxed">{preview.soap.plan}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
