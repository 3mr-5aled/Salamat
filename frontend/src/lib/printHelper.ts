export interface PrintConsultationData {
  patientName: string;
  date: string;
  time: string;
  notes: string;
  doctorName?: string;
  clinicName?: string;
}

export function buildConsultationPrintHTML(data: PrintConsultationData): string {
  let dx = "";
  let rx: Array<{ m: string; d?: string; f?: string; t?: string }> = [];
  if (data.notes) {
    try {
      const parsed = JSON.parse(data.notes);
      dx = parsed.dx || parsed.diagnosis || "";
      rx = Array.isArray(parsed.rx) ? parsed.rx : (Array.isArray(parsed.prescriptions) ? parsed.prescriptions : []);
    } catch {
      dx = data.notes;
    }
  }

  const rxHTML = rx.length > 0
    ? `
      <h3>Prescribed Medications</h3>
      <table>
        <thead>
          <tr>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${rx.map(item => `
            <tr>
              <td><strong>${item.m}</strong></td>
              <td>${item.d || "-"}</td>
              <td>${item.f || "-"}</td>
              <td>${item.t || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Salamat Consultation Record - ${data.patientName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            margin: 40px;
            font-size: 14px;
            line-height: 1.6;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #2563eb;
          }
          .hospital-info {
            text-align: right;
            font-size: 11px;
            color: #64748b;
            line-height: 1.4;
          }
          .title {
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #0f172a;
            margin-bottom: 30px;
            font-size: 18px;
            font-weight: 700;
          }
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
          }
          .meta-item {
            margin-bottom: 5px;
          }
          .meta-item strong {
            color: #475569;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            width: 120px;
          }
          h3 {
            color: #2563eb;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .dx-content {
            background-color: #fff;
            padding: 10px 5px;
            white-space: pre-line;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: left;
            padding: 10px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 1px solid #94a3b8;
            margin-top: 50px;
            padding-top: 8px;
            font-size: 12px;
            color: #64748b;
          }
          @media print {
            body { margin: 20px; }
            .meta-grid { background-color: #fff !important; border: 1px solid #cbd5e1; }
            th { background-color: #f8fafc !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SALAMAT</div>
          <div class="hospital-info">
            Salamat Medical Center<br/>
            123 El-Nasr St, Maadi, Cairo<br/>
            Hotline: 19999 | support@salamat.com
          </div>
        </div>

        <div class="title">Consultation & Prescription Record</div>

        <div class="meta-grid">
          <div class="meta-item"><strong>Patient Name:</strong> ${data.patientName}</div>
          <div class="meta-item"><strong>Date:</strong> ${data.date}</div>
          <div class="meta-item"><strong>Time:</strong> ${data.time}</div>
          <div class="meta-item"><strong>Doctor:</strong> ${data.doctorName || "Medical Specialist"}</div>
          ${data.clinicName ? `<div class="meta-item"><strong>Clinic:</strong> ${data.clinicName}</div>` : ""}
        </div>

        <h3>Clinical Diagnosis & Observations</h3>
        <div class="dx-content">${dx}</div>

        ${rxHTML}

        <div class="footer">
          <div style="font-size: 11px; color: #94a3b8;">
            Generated electronically by Salamat Clinic Portal on ${new Date().toLocaleDateString()}
          </div>
          <div class="signature-box">
            <div class="signature-line">Doctor Signature</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
}
