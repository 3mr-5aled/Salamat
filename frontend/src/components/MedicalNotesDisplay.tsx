import React from "react";

interface PrescriptionItem {
  m: string;
  d?: string;
  f?: string;
  t?: string;
}

interface Props {
  notes: string | undefined | null;
  compact?: boolean;
}

const MedicalNotesDisplay: React.FC<Props> = ({ notes, compact = false }) => {
  if (!notes) return null;

  let dx = "";
  let rx: PrescriptionItem[] = [];
  let isJson = false;

  try {
    const parsed = JSON.parse(notes);
    dx = parsed.dx || parsed.diagnosis || "";
    rx = Array.isArray(parsed.rx) ? parsed.rx : (Array.isArray(parsed.prescriptions) ? parsed.prescriptions : []);
    isJson = true;
  } catch {
    dx = notes;
  }

  if (!isJson) {
    return (
      <p className={`${compact ? "text-[11px]" : "text-xs"} italic text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100`}>
        {dx}
      </p>
    );
  }

  return (
    <div className={`space-y-3 bg-[#2563EB]/5 p-${compact ? "3" : "4"} rounded-xl border border-[#2563EB]/10`}>
      {dx && (
        <div>
          <span className={`${compact ? "text-[10px]" : "text-xs"} font-bold text-[#2563EB] uppercase tracking-wider block mb-1`}>
            Clinical Diagnosis
          </span>
          <p className={`${compact ? "text-[11px]" : "text-xs"} text-slate-700 leading-relaxed`}>{dx}</p>
        </div>
      )}

      {rx.length > 0 && (
        <div className="pt-2 border-t border-[#2563EB]/10">
          <span className={`${compact ? "text-[10px]" : "text-xs"} font-bold text-[#0F172A] uppercase tracking-wider block mb-2`}>
            Prescribed Medications
          </span>
          <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-${compact ? "1.5" : "2"}`}>
            {rx.map((med, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 text-[11px] space-y-1">
                <span className="font-bold text-[#0F172A] block">{med.m}</span>
                {compact ? (
                  (med.d || med.f || med.t) && (
                    <div className="text-slate-500">
                      {[med.d, med.f, med.t].filter(Boolean).join(" · ")}
                    </div>
                  )
                ) : (
                  <div className="text-slate-600 space-y-0.5 pl-2 border-l border-slate-100">
                    {med.d && <div><span className="font-semibold text-slate-500">Dose:</span> {med.d}</div>}
                    {med.f && <div><span className="font-semibold text-slate-500">Frequency:</span> {med.f}</div>}
                    {med.t && <div><span className="font-semibold text-slate-500">Duration:</span> {med.t}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalNotesDisplay;
