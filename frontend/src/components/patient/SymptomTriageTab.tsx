import React, { useState } from "react";
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { triageSymptoms } from "../../services/ai";
import type { TriageResult } from "../../services/ai";
import { getFriendlyAIErrorMessage } from "../../lib/error-parser";

interface SymptomTriageTabProps {
  onFindDoctor: (specialty: string) => void;
}

export const SymptomTriageTab: React.FC<SymptomTriageTabProps> = ({ onFindDoctor }) => {
  const [symptomsText, setSymptomsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TriageResult | null>(null);

  const handleAnalyze = async () => {
    if (!symptomsText.trim() || symptomsText.trim().length < 10) return;
    setLoading(true);
    setError(null);

    try {
      const res = await triageSymptoms(symptomsText.trim());
      setResult(res);
    } catch (err: any) {
      setError(getFriendlyAIErrorMessage(err, "triage"));
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency: "Low" | "Medium" | "High") => {
    switch (urgency) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <AlertTriangle size={14} className="text-red-600" />
            High Urgency
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            <AlertTriangle size={14} className="text-amber-600" />
            Medium Urgency
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Routine / Low Urgency
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2563EB]/10 via-[#14B8A6]/10 to-[#2563EB]/5 border border-[#2563EB]/20 rounded-3xl p-6 md:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>AI Clinical Assistant</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
          Smart Symptom Triage
        </h2>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed max-w-2xl">
          Describe what you are experiencing in plain words. Our AI assistant will analyze your symptoms and guide you to the right medical specialist.
        </p>
      </div>

      {/* Input Card */}
      <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-6 space-y-4">
          <label htmlFor="triage-symptoms-input" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            Describe Your Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            id="triage-symptoms-input"
            rows={5}
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            placeholder="e.g. I have had a dull headache behind my eyes for 2 days with light sensitivity and mild dizziness..."
            className="w-full p-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all placeholder:text-slate-400 resize-none"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400 font-medium">
              {symptomsText.trim().length < 10 ? "Please enter at least 10 characters" : `${symptomsText.trim().length} characters entered`}
            </span>
            <Button
              onClick={handleAnalyze}
              disabled={loading || symptomsText.trim().length < 10}
              className="w-full sm:w-auto h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing Symptoms...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </Button>
          </div>

          {/* Inline Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyze}
                className="h-8 px-3 text-xs border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <div className="bg-white border border-slate-200 shadow-md rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                <Stethoscope size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Recommended Specialty
                </span>
                <h3 className="text-xl font-black text-[#0F172A]">
                  {result.specialty}
                </h3>
              </div>
            </div>
            {getUrgencyBadge(result.urgency)}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Clinical Explanation</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              {result.explanation}
            </p>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              onClick={() => onFindDoctor(result.specialty)}
              className="h-12 px-8 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Find {result.specialty} Doctors</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
