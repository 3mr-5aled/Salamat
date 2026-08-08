import React, { useState } from "react";
import api from "../../services/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TriageResult {
  specialty: string;
  confidence: number;
  urgency: string;
  explanation: string;
}

export const SymptomTriageHelper: React.FC = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const analyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ai/triage", { symptoms });
      setResult(data.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to analyze symptoms");
    } finally {
      setLoading(false);
    }
  };

  const [applied, setApplied] = useState(false);

  const applyRecommendation = () => {
    if (result) {
      setApplied(true);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <textarea
        placeholder="Enter symptoms to get AI triage..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full rounded-xl border border-[#E2E8F0] p-2 text-xs focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all"
        rows={3}
      />
      <Button
        onClick={analyze}
        disabled={loading}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-4 py-2 text-xs font-bold"
      >
        {loading ? "Analyzing…" : "Analyze Symptoms"}
      </Button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {result && (
        <Card className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0F172A]">Recommended Specialty</h3>
            <Badge variant="outline" className="text-xs">{result.urgency}</Badge>
          </div>
          <p className="mt-2 text-xs text-[#64748B]">{result.explanation}</p>
          <p className="mt-1 text-sm font-bold text-[#2563EB]">{result.specialty}</p>
          <p className="mt-1 text-xs text-[#64748B]">Confidence: {result.confidence}%</p>
          {applied ? (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl text-center">
              ✓ Recommended specialty filter applied for {result.specialty}
            </div>
          ) : (
            <Button
              onClick={applyRecommendation}
              className="mt-3 w-full bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl px-4 py-2 text-xs font-bold"
            >
              Select {result.specialty} Clinic
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
