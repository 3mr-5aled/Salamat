// record-demo.mjs — Full Feature Demo Recording Script for Salamat
// Covers all 52 scenes across Landing, Auth, Patient, Doctor, and Admin portals
// Run with: node record-demo.mjs
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── CREDENTIALS (from seed-all.js) ───────────────────────────────────────────
const PATIENT_EMAIL = "mohamed@salamat.com";
const PATIENT_PASSWORD = "PatientPassword123";
const DOCTOR_EMAIL = "dr.ahmed@salamat.com";
const DOCTOR_PASSWORD = "DoctorPassword123";
const ADMIN_EMAIL = "admin@salamat.com";
const ADMIN_PASSWORD = "AdminPassword123";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function discoverPort() {
  const { chromium: cr } = await import("playwright");
  const b = await cr.launch({ headless: true });
  const pg = await b.newPage();
  let port = 5173;
  try {
    await pg.goto("http://localhost:5173", { timeout: 3000 });
  } catch {
    port = 5174;
  }
  await b.close();
  return port;
}

async function updateHUD(page, { step, title, description, tag }) {
  try {
    await page.evaluate(
      ({ step, title, description, tag }) => {
        let hud = document.getElementById("salamat-hud-overlay");
        if (!hud) {
          const style = document.createElement("style");
          style.innerHTML = `
          @keyframes hudIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes hudOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(12px); } }
          #salamat-hud-overlay { animation: hudIn 0.35s cubic-bezier(.16,1,.3,1); }
        `;
          document.head.appendChild(style);
          hud = document.createElement("div");
          hud.id = "salamat-hud-overlay";
          hud.style.cssText = [
            "position:fixed",
            "bottom:24px",
            "left:24px",
            "z-index:999999",
            "background:rgba(15,23,42,0.93)",
            "backdrop-filter:blur(18px)",
            "-webkit-backdrop-filter:blur(18px)",
            "border:1px solid rgba(37,99,235,0.35)",
            "border-left:6px solid #2563EB",
            "border-radius:14px",
            "padding:16px 22px",
            "color:#fff",
            'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
            "box-shadow:0 24px 40px -8px rgba(0,0,0,0.55),0 0 20px rgba(37,99,235,0.15)",
            "max-width:460px",
            "pointer-events:none",
            "min-width:320px",
          ].join(";");
          document.body.appendChild(hud);
        }
        hud.style.animation = "none";
        hud.offsetHeight; // reflow
        hud.style.animation = "hudIn 0.35s cubic-bezier(.16,1,.3,1)";
        hud.innerHTML = `
        <div style="font-size:10px;font-weight:800;color:#60A5FA;letter-spacing:1.4px;text-transform:uppercase;margin-bottom:5px;opacity:0.85">${step}</div>
        <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:5px;line-height:1.25">${title}</div>
        <div style="font-size:12.5px;color:#94A3B8;line-height:1.5;margin-bottom:10px">${description}</div>
        <span style="display:inline-flex;align-items:center;gap:5px;background:rgba(37,99,235,0.18);color:#93C5FD;border:1px solid rgba(37,99,235,0.3);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:6px;letter-spacing:0.3px">🏷 ${tag}</span>
      `;
      },
      { step, title, description, tag },
    );
  } catch {
    /* page may have navigated */
  }
}

async function smoothScroll(page, pixels) {
  await page.evaluate(
    (px) => window.scrollBy({ top: px, behavior: "smooth" }),
    pixels,
  );
  await sleep(400);
}

async function loginAs(page, baseUrl, email, password) {
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch {
    /* ignore */
  }
  await page.goto(`${baseUrl}/app/login`, { waitUntil: "domcontentloaded" });
  await sleep(400);

  const identifierInput = page
    .locator(
      '#identifier, input[name="identifier"], input[placeholder*="example"], input[type="text"]',
    )
    .first();
  await identifierInput.waitFor({ state: "visible", timeout: 5000 });
  await identifierInput.fill(email);
  await sleep(300);

  const passwordInput = page
    .locator('#password, input[name="password"], input[type="password"]')
    .first();
  await passwordInput.fill(password);
  await sleep(300);

  await page.click('button[type="submit"]');
  await sleep(1500);
}

// ─── INTRO & OUTRO SCENE RENDERERS ────────────────────────────────────────────
async function renderIntroScene(page) {
  console.log("  Scene 0.0 — Animated Intro Screen");
  let devLogoDataUri = "";
  try {
    const logoPath = path.resolve("./dev-logo.png");
    if (fs.existsSync(logoPath)) {
      devLogoDataUri = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
    }
  } catch {
    /* ignore */
  }

  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Salamat - Intro</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh;
          background: #0F172A;
          color: #F8FAFC;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .bg-glow {
          position: absolute;
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(15,23,42,0) 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .card {
          position: relative;
          z-index: 10;
          background: rgba(30, 41, 59, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 48px;
          max-width: 820px;
          width: 90%;
          text-align: center;
          box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.6), 0 0 32px rgba(37, 99, 235, 0.2);
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(37, 99, 235, 0.18);
          border: 1px solid rgba(37, 99, 235, 0.35);
          color: #60A5FA;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #60A5FA;
          border-radius: 50%;
          box-shadow: 0 0 8px #60A5FA;
        }
        h1 {
          font-size: 44px;
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 17px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 660px;
          margin-left: auto;
          margin-right: auto;
        }
        .developer-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px 24px;
          margin-bottom: 32px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          text-align: left;
        }
        .dev-logo-img {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .dev-info h3 {
          font-size: 16px;
          font-weight: 700;
          color: #F8FAFC;
        }
        .dev-info p {
          font-size: 13px;
          color: #60A5FA;
          font-family: monospace;
          margin-top: 2px;
        }
        .pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="bg-glow"></div>
      <div class="card">
        <div class="badge">
          <div class="pulse-dot"></div>
          <span>Full-Stack Healthcare System</span>
        </div>
        <h1>Salamat (سلامتك)</h1>
        <p class="subtitle">
          Comprehensive multi-role medical appointment management platform featuring Patient booking, Doctor schedule management, and Admin oversight.
        </p>
        
        <div class="developer-box">
          ${devLogoDataUri ? `<img src="${devLogoDataUri}" alt="Developer Logo" class="dev-logo-img" />` : '<div class="avatar">AM</div>'}
          <div class="dev-info">
            <h3>Amr Morcy (@3mr-5aled)</h3>
            <p>https://github.com/3mr-5aled/Salamat</p>
          </div>
        </div>

        <div class="pills">
          <span class="pill">React 18</span>
          <span class="pill">TypeScript</span>
          <span class="pill">Vite</span>
          <span class="pill">TanStack Router</span>
          <span class="pill">Node.js</span>
          <span class="pill">Express</span>
          <span class="pill">MongoDB</span>
          <span class="pill">Mongoose</span>
          <span class="pill">Playwright</span>
        </div>
      </div>
    </body>
    </html>
  `);
  await sleep(4000);
}

async function renderOutroScene(page) {
  console.log("  Scene 5.0 — Animated Outro Screen");
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Salamat - Outro</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh;
          background: #0F172A;
          color: #F8FAFC;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .bg-glow {
          position: absolute;
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(15,23,42,0) 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .card {
          position: relative;
          z-index: 10;
          background: rgba(30, 41, 59, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 48px;
          max-width: 720px;
          width: 90%;
          text-align: center;
          box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.6), 0 0 32px rgba(37, 99, 235, 0.2);
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(22, 163, 74, 0.18);
          border: 1px solid rgba(22, 163, 74, 0.35);
          color: #4ADE80;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 44px;
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 12px;
        }
        .subtitle {
          font-size: 18px;
          color: #94A3B8;
          margin-bottom: 32px;
        }
        .credit-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px 28px;
          display: inline-block;
          margin-bottom: 16px;
        }
        .dev-name {
          font-size: 18px;
          font-weight: 700;
          color: #F8FAFC;
        }
        .repo-link {
          font-size: 14px;
          color: #60A5FA;
          font-family: monospace;
          margin-top: 6px;
        }
      </style>
    </head>
    <body>
      <div class="bg-glow"></div>
      <div class="card">
        <div class="badge">
          <span>Demonstration Complete</span>
        </div>
        <h1>Thank You for Watching!</h1>
        <p class="subtitle">Salamat Medical Appointment Management System</p>
        
        <div class="credit-box">
          <div class="dev-name">Developed with ❤️ by Amr Morcy</div>
          <div class="repo-link">github.com/3mr-5aled/Salamat</div>
        </div>
      </div>
    </body>
    </html>
  `);
  await sleep(4000);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log("🎬 Salamat Full-Feature Demo Recording — 52 Scenes");

  console.log("🌱 Re-seeding database before recording...");
  try {
    execSync("npm run seed:all", { stdio: "inherit" });
    console.log("✅ Database successfully re-seeded!");
  } catch (seedErr) {
    console.warn(
      "⚠️ Warning: Seed script execution failed or skipped:",
      seedErr.message,
    );
  }

  const outputDir = path.resolve("./demo-recordings");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log("🔍 Detecting dev server port...");
  const port = await discoverPort();
  const BASE = `http://localhost:${port}`;
  console.log(`✅ Dev server at ${BASE}`);

  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    recordVideo: { dir: outputDir, size: { width: 1600, height: 900 } },
  });
  const page = await context.newPage();

  try {
    // ═══════════════════════════════════════════════════════════════════════
    // PART 0 — LANDING PAGE
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 PART 0 — Landing Page");

    // 0.0 — Intro Screen
    await renderIntroScene(page);

    // 0.1 — Hero
    console.log("  Scene 0.1 — Hero section");
    await page.goto(BASE, { waitUntil: "networkidle" });
    await updateHUD(page, {
      step: "INTRO • PUBLIC LANDING PAGE",
      title: "Medical Care, Simplified",
      description:
        "Salamat's public landing page — featuring live hospital statistics, specialty showcases, patient testimonials, and emergency contact info.",
      tag: "Landing Page",
    });
    await sleep(1600);

    // 0.2 — Live Stats
    console.log("  Scene 0.2 — Stats & Features");
    await smoothScroll(page, 500);
    await updateHUD(page, {
      step: "LANDING • LIVE HOSPITAL STATISTICS",
      title: "Real-Time API-Driven Statistics",
      description:
        "Active Departments and Consultant Specialists counts are fetched live from the backend on every page load — always up to date.",
      tag: "Live API Data",
    });
    await sleep(1600);

    // 0.3 — Features + Achievements + Testimonials
    console.log("  Scene 0.3 — Features & Testimonials");
    await smoothScroll(page, 600);
    await updateHUD(page, {
      step: "LANDING • FEATURES & ACHIEVEMENTS",
      title: "A Complete Medical Ecosystem",
      description:
        "Real-Time Scheduling, Digital Medical Notes, Personal Profiles — backed by 15k+ happy patients, a 99.2% booking success rate, and 25+ elite specialists.",
      tag: "Feature Showcase",
    });
    await sleep(1600);
    await smoothScroll(page, 700);
    await sleep(2000);

    // 0.4 — Emergency Hotline & Public Contact
    console.log("  Scene 0.4 — Emergency Hotline & Contact");
    try {
      await page.locator('#emergency').scrollIntoViewIfNeeded();
      await sleep(600);
    } catch {
      await smoothScroll(page, 400);
    }
    await updateHUD(page, {
      step: "LANDING • EMERGENCY HOTLINE",
      title: "24/7 Toll-Free Emergency Line (19999)",
      description:
        "Critical emergency response coordinators and ambulances on standby — direct emergency hotline accessible right from the landing page.",
      tag: "Emergency Hotline",
    });
    await sleep(1800);

    try {
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await sleep(600);
    } catch {
      await smoothScroll(page, 600);
    }
    await updateHUD(page, {
      step: "LANDING • HOSPITAL CONTACT",
      title: "Hospital Coordinates & Direct Support Channels",
      description:
        "Instant support via WhatsApp (+20 123 456 7890), Facebook Page, direct hospital phone lines, and address map directions.",
      tag: "Public Contact",
    });
    await sleep(1800);

    // ═══════════════════════════════════════════════════════════════════════
    // PART 1 — AUTHENTICATION
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 PART 1 — Authentication");

    // 1.1 — Signup page
    console.log("  Scene 1.1 — Signup page");
    await page.goto(`${BASE}/app/signup`, { waitUntil: "domcontentloaded" });
    await sleep(500);
    await updateHUD(page, {
      step: "AUTH • REGISTRATION PAGE",
      title: "Patient & Doctor Registration",
      description:
        "New users register as a Patient or Doctor. Doctors choose their specialization and are queued for admin verification before accessing the portal.",
      tag: "Role-Based Signup",
    });
    await sleep(1400);

    // 1.2 — Fill signup form (patient)
    console.log("  Scene 1.2 — Fill signup form");
    try {
      await page.fill('input[placeholder*="John Doe"]', "Demo Patient");
      await sleep(400);
      await page.fill('input[type="email"]', "demo.patient@salamat.com");
      await sleep(400);
      const pwFields = await page.$$('input[type="password"]');
      if (pwFields.length >= 2) {
        await pwFields[0].fill("StrongPass123!");
        await sleep(300);
        await pwFields[1].fill("StrongPass123!");
        await sleep(300);
      }
    } catch {
      /* field may differ */
    }
    await updateHUD(page, {
      step: "AUTH • FORM VALIDATION",
      title: "Secure Account Creation with Real-Time Validation",
      description:
        "Full name, email, and password fields validate inline. Passwords are hashed server-side with bcrypt. Self-registration creates Patient accounts.",
      tag: "Form Validation",
    });
    await sleep(1400);

    // 1.3 — Patient registration focus
    console.log("  Scene 1.3 — Patient registration details");
    await updateHUD(page, {
      step: "AUTH • PATIENT REGISTRATION",
      title: "Patient Portal Account Creation",
      description:
        "Self-service registration provisions patient profiles. Doctor accounts and initial login credentials are issued directly by System Administrators.",
      tag: "Patient Registration",
    });
    await sleep(1400);

    // 1.4 — Login as Patient
    console.log("  Scene 1.4 — Login flow");
    await updateHUD(page, {
      step: "AUTH • SIGN IN",
      title: "Flexible Credential-Based Login",
      description:
        "Login accepts both email address OR phone number. Invalid credentials surface an inline error banner. Role-based redirect: Patient → Portal, Admin → Console.",
      tag: "JWT Authentication",
    });
    await loginAs(page, BASE, PATIENT_EMAIL, PATIENT_PASSWORD);

    // ═══════════════════════════════════════════════════════════════════════
    // PART 2 — PATIENT PORTAL
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 PART 2 — Patient Portal");

    // 2.1 — Patient Overview
    console.log("  Scene 2.1 — Overview");
    await updateHUD(page, {
      step: "PATIENT • OVERVIEW DASHBOARD",
      title: "Personalized Health Dashboard",
      description:
        "Mohamed Ali's dashboard: Active Bookings count, Completed Visits, and Registered Clinics. A daily rotating Wellness Tip updates automatically each day.",
      tag: "Patient Dashboard",
    });
    await sleep(2000);

    // 2.1b — Patient Emergency & Support Section
    console.log("  Scene 2.1b — Patient Support & Hotline");
    await smoothScroll(page, 550);
    await updateHUD(page, {
      step: "PATIENT • EMERGENCY HOTLINE & SUPPORT",
      title: "24/7 Emergency Hotline & Direct Hospital Channels",
      description:
        "Direct access to the 19999 toll-free Emergency Hotline, instant WhatsApp support (+20 123 456 7890), Facebook page, phone desk, and hospital location.",
      tag: "Patient Support",
    });
    await sleep(2500);
    await smoothScroll(page, -550);
    await sleep(1000);

    // 2.2 — Notification Bell
    console.log("  Scene 2.2 — Notification Bell");
    try {
      // Target the SVG bell button specifically — avoid accidentally clicking nav items
      const bell = page
        .locator(
          'button svg[class*="bell"], button svg[class*="Bell"], button[class*="bell"], button[aria-label*="notif"]',
        )
        .first();
      if ((await bell.count()) > 0) {
        await bell.click();
      } else {
        // Fallback: find any button containing an SVG in the header/sidebar area
        await page
          .locator("header button, nav button, aside button")
          .filter({ has: page.locator("svg") })
          .first()
          .click();
      }
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • NOTIFICATIONS",
      title: "Real-Time Notification Bell",
      description:
        'Polls every 15 seconds for new notifications. Shows a red unread count badge. Mohamed Ali has a seeded "Appointment Approved" notification from Dr. Ahmed Hassan.',
      tag: "Live Notifications",
    });
    await sleep(1600);
    // Close bell dropdown by clicking elsewhere on the page body
    try {
      await page
        .locator('main, [role="main"], .main-content')
        .first()
        .click({ position: { x: 200, y: 200 }, force: true });
    } catch {
      await page.mouse.click(800, 100); // Click empty header area to dismiss
    }
    await sleep(400);

    // 2.3 — Navigate to Check Symptoms tab
    console.log("  Scene 2.3 — Symptom Triage tab");
    try {
      // Use separate locators with .first() fallback chain
      const checkSymptoms = page.locator("text=Check Symptoms");
      const triage = page.locator("text=Triage");
      if ((await checkSymptoms.count()) > 0) {
        await checkSymptoms.first().click();
      } else if ((await triage.count()) > 0) {
        await triage.first().click();
      }
      await sleep(500);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • AI SYMPTOM TRIAGE",
      title: "Smart Symptom Triage Powered by AI",
      description:
        "Describe symptoms in plain language. The AI analyzes them and recommends the right medical specialty with an urgency rating (High / Medium / Routine) and clinical explanation.",
      tag: "AI Clinical Assistant",
    });
    await sleep(1600);

    // 2.4 — Type symptoms and analyze
    console.log("  Scene 2.4 — Type symptoms");
    try {
      const symptomInput = page
        .locator('textarea[id="triage-symptoms-input"], textarea')
        .first();
      await symptomInput.fill(
        "I have been experiencing chest tightness and shortness of breath during light exercise, along with occasional heart palpitations for the past week.",
      );
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • ENTERING SYMPTOMS",
      title: "Natural Language Symptom Description",
      description:
        "Patient types symptoms in plain language. A character counter validates minimum 10 characters before enabling the Analyze button. No medical jargon required.",
      tag: "Natural Language Input",
    });
    await sleep(600);

    // 2.5 — Click Analyze
    console.log("  Scene 2.5 — Analyze symptoms");
    try {
      await page.locator('button:has-text("Analyze Symptoms")').click();
      await sleep(500);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • AI ANALYSIS IN PROGRESS",
      title: "Live AI Symptom Analysis",
      description:
        "The AI processes the symptom description, evaluates clinical urgency, and returns a specialty recommendation with a detailed rationale. Spinner shows while processing.",
      tag: "AI Processing",
    });
    await sleep(2500); // wait for AI response

    // 2.6 — Show result
    await updateHUD(page, {
      step: "PATIENT • TRIAGE RESULT DELIVERED",
      title: "Specialty Recommendation + Urgency Rating",
      description:
        "Recommended specialty, color-coded urgency badge (High = red, Medium = amber, Routine = emerald), and a full AI clinical explanation. One click routes to matching doctors.",
      tag: "AI Result Card",
    });
    await sleep(2000);

    // 2.7 — Click "Find Doctors" button in result
    console.log("  Scene 2.7 — Find specialty doctors");
    try {
      await page
        .locator('button:has-text("Find"), button:has-text("Doctor")')
        .last()
        .click();
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • AUTO-SPECIALTY FILTER",
      title: "Smart Specialty Pre-Filter Applied",
      description:
        'Clicking the AI result instantly switches to "Book Appointment" with the recommended specialty pre-applied as a filter — no manual searching required.',
      tag: "Seamless Navigation",
    });
    await sleep(1400);

    // 2.8 — Find Doctor tab — search bar + specialty pills
    console.log("  Scene 2.8 — Doctor search & filters");
    await updateHUD(page, {
      step: "PATIENT • DOCTOR SEARCH & FILTERS",
      title: "Multi-Axis Doctor Search",
      description:
        "Search by doctor name, specialty, or clinic. Color-coded specialty filter pills for all 11 specialties. Combines with live text search for precise instant results.",
      tag: "Search & Filter",
    });
    await sleep(1600);

    // Type in search
    try {
      const searchInput = page.locator('input[placeholder*="Search"]').first();
      await searchInput.fill("Ahmed");
      await sleep(700);
      await searchInput.fill("");
      await sleep(350);
    } catch {
      /* ignore */
    }

    // 2.9 — Click "View Slots" on first doctor card
    console.log("  Scene 2.9 — Slot picker");
    try {
      await page.locator('button:has-text("View Slots")').first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • DYNAMIC SLOT PICKER",
      title: "Morning / Afternoon / Evening Shift Grouping",
      description:
        "Slots auto-grouped by time-of-day shift. Each card shows availability status, current vs. max patient count, slot type badge (general / emergency / surgery), and date.",
      tag: "Dynamic Scheduling",
    });
    await sleep(1800);

    // 2.10 — Date filter
    console.log("  Scene 2.10 — Date filter");
    try {
      // Only click Today/Tomorrow if those buttons actually exist (seeded sessions must be present)
      const todayBtn = page.locator('button:has-text("Today")').first();
      if ((await todayBtn.count()) > 0) {
        await todayBtn.click();
        await sleep(600);
      }
      const tomorrowBtn = page.locator('button:has-text("Tomorrow")').first();
      if ((await tomorrowBtn.count()) > 0) {
        await tomorrowBtn.click();
        await sleep(600);
      }
      // Always reset to show all slots so Book Slot button is guaranteed visible
      const allDatesBtn = page.locator(
        'button:has-text("All Available Dates")',
      );
      if ((await allDatesBtn.count()) > 0) {
        await allDatesBtn.first().click();
        await sleep(700); // give the slot list time to re-render fully
      }
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • DATE QUICK-FILTERS",
      title: "One-Click Date Navigation",
      description:
        'Filter slots to Today, Tomorrow, or any specific date with a single click. "All Available Dates" clears the filter to show every upcoming open slot.',
      tag: "Date Filtering",
    });
    await sleep(1400);

    // 2.11 — Click "Book Slot" → BookingConfirmModal
    console.log("  Scene 2.11 — Book Slot modal");
    try {
      // Wait up to 5 s for a bookable slot to appear before clicking
      await page.waitForSelector('button:has-text("Book Slot")', {
        timeout: 5000,
      });
      await page.locator('button:has-text("Book Slot")').first().click();
      await sleep(600);
    } catch {
      console.warn(
        '  ⚠ No "Book Slot" button found — skipping modal scene (no available slots for this doctor today)',
      );
    }
    await updateHUD(page, {
      step: "PATIENT • BOOKING CONFIRMATION MODAL",
      title: "Appointment Booking Confirmation",
      description:
        "Modal shows the exact date, time, and clinic. Patient adds a symptom description before confirming. The slot summary card shows current vacancy status.",
      tag: "Booking Modal",
    });
    await sleep(1600);

    // 2.12 — Fill symptoms and cancel (preserve seeded data)
    console.log("  Scene 2.12 — Fill booking form");
    try {
      // Only fill if a dialog/modal is actually open
      const modalTextarea = page.locator(
        'dialog textarea, [role="dialog"] textarea, textarea[id="modal-symptoms"]',
      );
      if ((await modalTextarea.count()) > 0) {
        await modalTextarea
          .last()
          .fill(
            "Follow-up for chest tightness and palpitations. Requesting cardiology consultation.",
          );
        await sleep(700);
      }
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • SUBMITTING BOOKING REQUEST",
      title: "Symptom Notes + Booking Submission",
      description:
        'Patient adds symptom/reason notes before confirming. Upon submission, status starts as "Pending Approval". Doctor and admin are notified instantly.',
      tag: "Request Submission",
    });
    await sleep(1400);
    // Cancel to preserve seeded data
    try {
      await page.locator('button:has-text("Cancel")').last().click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // Navigate back to sidebar
    try {
      await page
        .locator(
          'button:has-text("← Back"), button:has-text("Back to Doctors")',
        )
        .first()
        .click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // 2.13 — My Bookings tab
    console.log("  Scene 2.13 — My Bookings tab");
    try {
      await page.locator("text=My Bookings").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • MY BOOKINGS TRACKER",
      title: "Registration & Booking Status Tracker",
      description:
        "Bookings split into: Awaiting Admin Approval (amber), Confirmed Visits (green), and a collapsible Past & Archived section. Cancel buttons on eligible future bookings.",
      tag: "Booking Management",
    });
    await sleep(2000);

    // 2.14 — Expand archived section
    console.log("  Scene 2.14 — Archived bookings");
    try {
      await page.locator('button:has-text("View Past")').first().click();
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • VISIT HISTORY & ARCHIVE",
      title: "Collapsible Past & Archived Visits",
      description:
        "Past, completed, cancelled, and rejected bookings collapse into an archive. Color-coded status badges: Pending (amber), Approved (green), Completed (blue), Cancelled/Rejected (red).",
      tag: "Archived History",
    });
    await sleep(1600);

    // 2.15 — View Prescription on completed booking
    console.log("  Scene 2.15 — View Prescription modal");
    try {
      await page
        .locator('button:has-text("View Prescription")')
        .first()
        .click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "PATIENT • DIGITAL PRESCRIPTION CARD",
      title: "Verified Digital Medical Prescription",
      description:
        'Full prescription card: clinic header, doctor name, clinical diagnosis ("Mild tachycardia"), and Rx table — Beta-blocker 5mg once daily + Multivitamin 30 days. One-click Print.',
      tag: "Digital Medical Record",
    });
    await sleep(2500);
    // Close prescription
    try {
      await page.locator('button:has-text("Close")').last().click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PART 3 — DOCTOR PORTAL
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 PART 3 — Doctor Portal");

    // Log out patient, log in as doctor
    await loginAs(page, BASE, DOCTOR_EMAIL, DOCTOR_PASSWORD);

    // 3.1 — Doctor Overview
    console.log("  Scene 3.1 — Doctor Overview");
    await updateHUD(page, {
      step: "DOCTOR • PRACTICE DASHBOARD",
      title: "Dr. Ahmed Hassan — Cardiology Dashboard",
      description:
        "Overview shows today's scheduled visits, weekly practice hours (Mon/Wed/Fri 09:00–17:00), and verified account status. One-click to navigate to Patient Schedule.",
      tag: "Doctor Dashboard",
    });
    await sleep(2000);

    // 3.2 — Patient Visits tab
    console.log("  Scene 3.2 — Patient Visits tab");
    try {
      await page.locator("text=Patient Visits").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • PATIENT VISIT QUEUE",
      title: "Patient Registration Queue",
      description:
        "Sessions grouped as Today, Upcoming, and Past. Each patient row shows email, phone, gender, age, blood type, chronic diseases, emergency contact, and reported symptoms.",
      tag: "Patient Queue",
    });
    await sleep(2000);

    // 3.3 — Patient Queue & Session Review
    console.log("  Scene 3.3 — Patient Queue");
    await updateHUD(page, {
      step: "DOCTOR • PATIENT VISIT MANAGEMENT",
      title: "Patient Visit Details & Clinical Queue",
      description:
        "Doctors review patient session details and health history. Registrations are approved by Admin prior to consultation.",
      tag: "Patient Management",
    });
    await sleep(1800);

    // 3.4 — Start Consultation (if available)
    console.log("  Scene 3.4 — Consultation Panel");
    try {
      const startBtn = page
        .locator('button:has-text("Start Consultation")')
        .first();
      await startBtn.click();
      await sleep(2000);
    } catch {
      /* no active session, that's fine */
    }
    await updateHUD(page, {
      step: "DOCTOR • CLINICAL CONSULTATION PANEL",
      title: "Interactive Consultation Panel",
      description:
        "Full panel opens with patient-reported symptoms as read-only context. Doctor enters clinical diagnosis. The AI Assistant activates once 10+ characters are typed.",
      tag: "Consultation Panel",
    });
    await sleep(2000);

    // Try filling diagnosis
    try {
      const diagTextarea = page
        .locator(
          'textarea[placeholder*="clinical"], textarea[placeholder*="diagnosis"]',
        )
        .first();
      await diagTextarea.fill(
        "Patient presents with mild tachycardia and occasional palpitations. Blood pressure within normal limits. Recommending beta-blocker and lifestyle modification.",
      );
      await sleep(700);
    } catch {
      /* ignore */
    }

    // 3.5 — AI SOAP Helper
    console.log("  Scene 3.5 — AI SOAP note generator");
    await updateHUD(page, {
      step: "DOCTOR • AI SOAP NOTE GENERATOR",
      title: "AI Structures Clinical Notes into SOAP Format",
      description:
        "With 10+ characters in the diagnosis field, the AI Assistant activates. It structures free-text clinical notes into Subjective, Objective, Assessment, and Plan sections.",
      tag: "AI SOAP Notes",
    });
    await sleep(2000);

    // Click AI button if visible
    try {
      await page
        .locator('button:has-text("Structure with AI"), button:has-text("AI")')
        .first()
        .click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await sleep(1600);

    // 3.6 — Apply or discard SOAP
    await updateHUD(page, {
      step: "DOCTOR • SOAP PREVIEW & APPLY",
      title: "Preview, Discard, or Apply the SOAP Note",
      description:
        'AI generates a dark preview card with the 4 SOAP sections. "Apply SOAP Note" pastes it directly into the diagnosis field. "Discard" clears it if unsatisfactory.',
      tag: "One-Click Apply",
    });
    await sleep(1600);

    // 3.7 — Medications
    console.log("  Scene 3.7 — Add medication");
    try {
      await page.locator('button:has-text("Add Medication")').first().click();
      await sleep(500);
      // Fill medication name
      await page
        .locator('input[placeholder="Medication Name"]')
        .last()
        .fill("Metoprolol");
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • STRUCTURED RX BUILDER",
      title: "Medication Prescription Row Builder",
      description:
        "Add multiple medication rows: name, standardized dosage dropdown (250mg–1g), frequency (Once daily to PRN), and duration. Custom options available for non-standard dosages.",
      tag: "Digital Rx Builder",
    });
    await sleep(2000);

    // 3.8 — Close consultation panel
    try {
      await page
        .locator('button:has-text("Cancel"), button:has-text("Close")')
        .first()
        .click();
      await sleep(350);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • CONSULTATION RECORD SAVED",
      title: "Structured JSON Prescription Saved to Record",
      description:
        "Completed consultations are stored as structured JSON (diagnosis + medication list). The patient's prescription is immediately viewable and printable from the Patient Portal.",
      tag: "Record Persistence",
    });
    await sleep(1600);

    // 3.9 — Consultation Hours tab
    console.log("  Scene 3.9 — Consultation Hours");
    try {
      await page.locator("text=Consultation Hours").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • CONSULTATION SCHEDULE",
      title: "Personal Session Schedule Viewer",
      description:
        "Doctor's own sessions grouped into Today, Upcoming, and Past. Each card shows session type badge, capacity (X/Y), time interval, and status (Scheduled / Completed / Cancelled).",
      tag: "Schedule Management",
    });
    await sleep(2000);

    // 3.10 — Cancellation control panel
    console.log("  Scene 3.10 — Cancellation panel");
    await updateHUD(page, {
      step: "DOCTOR • EMERGENCY CANCELLATION",
      title: "Session Cancellation Control Panel",
      description:
        'Cancel selected date\'s sessions with a mandatory reason. Choose "Rest of the Day" or "Whole Day" range. Essential for unexpected absences or emergency situations.',
      tag: "Cancellation Control",
    });
    await sleep(1800);

    // 3.11 — My Patients Directory
    console.log("  Scene 3.11 — Patient Directory");
    try {
      await page.locator("text=My Patients").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • PATIENT DIRECTORY",
      title: "Private Patient Directory with Live Search",
      description:
        "All patients who have had sessions with Dr. Ahmed Hassan. Live name search. Each card shows gender, blood type, age, and chronic disease tags (Diabetes, Hypertension, etc.).",
      tag: "Patient Records",
    });
    await sleep(2000);

    // 3.12 — Expand patient + clinical notes
    console.log("  Scene 3.12 — Patient details + clinical notes");
    try {
      await page.locator('button:has-text("View Details")').first().click();
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • PRIVATE CLINICAL NOTES",
      title: "Doctor-Private Clinical Notes per Patient",
      description:
        "Doctors add private clinical observations per patient — visible only to them, not the patient. Prior consultation history with MedicalNotesDisplay renders below for context.",
      tag: "Private Notes",
    });
    await sleep(2000);

    // 3.13 — Contact Admin modal
    console.log("  Scene 3.13 — Contact Admin modal");
    try {
      await page.locator('button:has-text("Contact Admin")').first().click();
      await sleep(600);
      await page
        .locator("textarea")
        .last()
        .fill(
          "Requesting maintenance scheduling for Room 301 equipment update and consultation room availability check.",
        );
      await sleep(500);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "DOCTOR • DIRECT ADMIN MESSAGING",
      title: "Contact Administration Direct Inbox",
      description:
        "Doctors send messages directly to hospital administration — schedule requests, facility issues, or queries. Admin reads them in the Messages tab of the Admin Console.",
      tag: "Admin Messaging",
    });
    await sleep(2000);
    try {
      await page
        .locator('button:has-text("Close"), button:has-text("Cancel")')
        .last()
        .click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PART 4 — ADMIN CONSOLE
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 PART 4 — Admin Console");

    // Log out doctor, log in as admin
    await loginAs(page, BASE, ADMIN_EMAIL, ADMIN_PASSWORD);

    // 4.1 — Admin Overview
    console.log("  Scene 4.1 — Admin Overview");
    try {
      await page.waitForSelector('.grid, [data-testid="admin-dashboard-stats"]', { timeout: 8000 });
      await sleep(600);
    } catch {
      await sleep(1500);
    }
    await updateHUD(page, {
      step: "ADMIN • OPERATIONS DASHBOARD",
      title: "Unified Admin Operations Dashboard",
      description:
        "Live metrics: Total Clinics, Active Doctors, Registered Patients, Total Appointments — all fetched live from the API. System Health monitor shows module status and version v1.0.0.",
      tag: "Admin Dashboard",
    });
    await sleep(2000);
    await smoothScroll(page, 450);
    await sleep(2500);
    await smoothScroll(page, -450);
    await sleep(1200);

    // 4.2 — Quick Booking
    console.log("  Scene 4.2 — Quick Booking");
    try {
      await page
        .locator('button:has-text("Start Quick Booking")')
        .first()
        .click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • QUICK BOOKING PORTAL",
      title: "Admin Quick Booking on Behalf of Patients",
      description:
        "Admins book appointments for any patient: search existing by name/phone or create a temporary walk-in profile, then select clinic, doctor, and available slot.",
      tag: "Rapid Booking Flow",
    });
    await sleep(2000);
    try {
      await page
        .locator(
          'button:has(span:has-text("Close")), button:has-text("Close"), button:has-text("Cancel")',
        )
        .first()
        .click();
      await sleep(350);
    } catch {
      await page.keyboard.press("Escape");
      await sleep(350);
    }

    // 4.3 — Pending Approvals tab
    console.log("  Scene 4.3 — Pending Approvals");
    try {
      await page.locator("text=Pending Approvals").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • APPOINTMENT APPROVAL PIPELINE",
      title: "System-Wide Pending Appointment Approvals",
      description:
        "All pending booking requests across all doctors in one view. Each card shows patient details, doctor, clinic, date/time, and symptoms. Nour El-Din's Oncology request shown.",
      tag: "Approval Pipeline",
    });
    await sleep(2000);

    // 4.4 — Approve one booking
    console.log("  Scene 4.4 — Approve booking");
    await updateHUD(page, {
      step: "ADMIN • ONE-CLICK BOOKING APPROVAL",
      title: "Platform-Wide Approval Authority",
      description:
        'Admins hold system-wide approval power over all bookings. Clicking "Approve Appointment" confirms the booking and triggers a real-time notification to the patient.',
      tag: "Approval Authority",
    });
    await sleep(1600);

    // 4.5 — Doctors Directory tab
    console.log("  Scene 4.5 — Doctors Directory");
    try {
      await page.locator('button:has-text("doctors"), button:has-text("Doctors")').first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • DOCTORS DIRECTORY",
      title: "Full Doctor Management with CRUD",
      description:
        "Table shows all 5 doctors: name, specialization, experience, clinic location, qualifications. Add new doctor accounts or edit existing profiles including weekly practice hours.",
      tag: "Doctor Management",
    });
    await sleep(2000);

    // 4.6 — Add Doctor modal
    console.log("  Scene 4.6 — Add Doctor modal");
    try {
      await page.locator('button:has-text("Add Doctor")').first().click();
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • CREATE DOCTOR ACCOUNT",
      title: "Doctor Profile: Credentials, Specialty & Schedule",
      description:
        "Create a full doctor account: name, email, specialization (11 options), clinic assignment, gender, date of birth, and weekly availability schedule per day of the week.",
      tag: "Doctor Creation",
    });
    await sleep(2200);
    try {
      await page.locator('button:has-text("Cancel")').last().click();
      await sleep(350);
    } catch {
      console.warn(
        "  ⚠ Cancel button not found — skipping modal close (may be disabled in this build)",
      );
    }

    // 4.7 — Clinics Registry tab
    console.log("  Scene 4.7 — Clinics Registry");
    try {
      await page.locator('button:has-text("clinics"), button:has-text("Clinics")').first().click();
      await sleep(700);
    } catch {
      console.warn(
        "  ⚠ Clinics tab not found — skipping clinic registry scene (may be disabled in this build)",
      );
    }
    await updateHUD(page, {
      step: "ADMIN • CLINICS REGISTRY",
      title: "Full Clinic Network Management (CRUD)",
      description:
        "5 seeded clinics: Cardiology (3F-301), Pediatrics (2F-205), Orthopedics (4F-410), Oncology (5F-502), Neurology (4F-415). Add, edit, delete clinics and assign doctors.",
      tag: "Clinic CRUD",
    });
    await sleep(2000);

    // 4.8 — Add Clinic modal
    console.log("  Scene 4.8 — Add Clinic modal");
    try {
      await page.locator('button:has-text("Add Clinic")').first().click();
      await sleep(600);
      await page
        .locator('input[placeholder*="Clinic Name"], input')
        .first()
        .fill("Internal Medicine Clinic");
      await sleep(600);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • CREATE NEW CLINIC",
      title: "Clinic Creation: Name, Specialty, Floor & Room",
      description:
        "Define clinic name, clinic number (CL-XXX), specialty, floor, room, and description. The new clinic appears immediately in doctor assignment and booking dropdowns.",
      tag: "Clinic Creation",
    });
    await sleep(2000);
    try {
      await page.locator('button:has-text("Cancel")').last().click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // 4.9 — Assign Doctor to clinic
    console.log("  Scene 4.9 — Assign Doctor");
    try {
      await page.locator('button:has-text("Assign Doctor")').first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • DOCTOR-CLINIC ASSIGNMENT",
      title: "Assign or Unlink Doctors per Clinic",
      description:
        "Only doctors with matching specialty are listed in the assignment modal. Unlink a doctor from a clinic with a single click on the link icon. Specialty matching enforced.",
      tag: "Doctor Assignment",
    });
    await sleep(1800);
    try {
      await page
        .locator('button:has-text("Cancel"), button:has-text("Close")')
        .last()
        .click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // 4.10 — Patients Directory tab
    console.log("  Scene 4.10 — Patients Directory");
    try {
      await page.locator('button:has-text("patients"), button:has-text("Patients")').first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • PATIENT REGISTRY",
      title: "Patient Directory with Inline Appointment History",
      description:
        "Table shows all 3 patients: Mohamed Ali (O+, Diabetes), Fatma Ibrahim (A-, Hypertension+Asthma), Nour El-Din (B+). Expand any row to see full appointment history inline.",
      tag: "Patient Registry",
    });
    await sleep(2000);

    // 4.11 — Expand patient appointment history
    console.log("  Scene 4.11 — Inline appointment history");
    try {
      await page
        .locator('button:has-text("View Appointments")')
        .first()
        .click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • INLINE APPOINTMENT HISTORY",
      title: "Patient Appointment History Expands Inline",
      description:
        "Per-appointment cards show: status badge, doctor name, clinic, date, registration status, and structured prescription notes via MedicalNotesDisplay — no page navigation needed.",
      tag: "Appointment History",
    });
    await sleep(2000);

    // 4.12 — Consultation Sessions tab
    console.log("  Scene 4.12 — Consultation Sessions");
    try {
      await page.locator("text=Slots").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • SESSION SCHEDULING CONTROL",
      title: "Consultation Session Control Center",
      description:
        "Filter sessions by doctor and date. Create new sessions: date, start/end time, duration, optional weekly repeat. Cancel a doctor's entire day (sickness/vacation). Live capacity preview.",
      tag: "Session Control",
    });
    await sleep(2000);

    // 4.13 — Create Session modal
    console.log("  Scene 4.13 — Create Session modal");
    try {
      // Select a doctor first
      const doctorSelect = page.locator("select").first();
      await doctorSelect.selectOption({ index: 1 });
      await sleep(350);
      await page.locator('button:has-text("Create Session")').first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • SESSION CREATION MODAL",
      title: "Dynamic Session Generator with Capacity Preview",
      description:
        'Set date, start time (e.g. 09:00), end time (e.g. 17:00), and appointment duration (15 min). System auto-calculates slot count and shows "32 Patient Slots" live preview.',
      tag: "Session Generator",
    });
    await sleep(2500);
    try {
      await page.locator('button:has-text("Cancel")').last().click();
      await sleep(350);
    } catch {
      /* ignore */
    }

    // 4.14 — Messages tab
    console.log("  Scene 4.14 — Admin Messages Inbox");
    try {
      await page.locator("text=Doctor Messages").first().click();
      await sleep(700);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • DOCTOR INQUIRY INBOX",
      title: "Doctor Messages & Facility Requests Inbox",
      description:
        "Admin message hub reserved exclusively for Doctor communications (equipment requests, facility support, schedule adjustments). Patients contact support directly via Hotline, WhatsApp, or Facebook.",
      tag: "Doctor Messaging",
    });
    await sleep(2000);

    // 4.15 — Mark all as read
    console.log("  Scene 4.15 — Mark all as read");
    try {
      await page.locator('button:has-text("Mark all as read")').first().click();
      await sleep(500);
    } catch {
      /* ignore */
    }
    await updateHUD(page, {
      step: "ADMIN • BULK MESSAGE MANAGEMENT",
      title: 'One-Click "Mark All as Read"',
      description:
        "Single click clears all unread indicators across the inbox. Unread count badge in the sidebar updates immediately to reflect the new read state.",
      tag: "Bulk Actions",
    });
    await sleep(1600);

    // ═══════════════════════════════════════════════════════════════════════
    // OUTRO
    // ═══════════════════════════════════════════════════════════════════════
    console.log("\n📍 OUTRO — Wrap Up");
    await renderOutroScene(page);

    console.log("\n✅ All 52 scenes recorded successfully!");
  } catch (err) {
    console.error("\n⚠️  Unexpected error during recording:", err.message);
  } finally {
    console.log("💾 Finalizing video file...");
    await context.close();
    await browser.close();
    const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".webm"));
    console.log(`\n🎉 Done! Video saved to ./demo-recordings/`);
    files.forEach((f) => {
      const size = (
        fs.statSync(path.join(outputDir, f)).size / 1048576
      ).toFixed(2);
      console.log(`   📹 ${f} (${size} MB)`);
    });
  }
})();
