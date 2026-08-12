# Design Spec: Demo Video Enhancements, Intro/Outro Screens & Flow Fixes

**Date**: 2026-08-12  
**Author**: Amr Morcy (@3mr-5aled) & Antigravity Assistant  
**Target File**: `record-demo.mjs` & `todo.md`  

---

## 1. Executive Summary

This design specification details the updates for the **Salamat** medical appointment system automated demo recording script (`record-demo.mjs`). The enhancements introduce modern, animated **Intro** and **Outro** screens and adjust scene execution timings/flows in the landing page and admin portal sections.

---

## 2. Intro and Outro Screens Architecture

### 2.1 Implementation Method
- Implemented as inline full-screen HTML scenes inside Playwright using `page.setContent(...)`.
- Zero changes to production React code or routing (`frontend/src/routes/`).
- Center-aligned layout with CSS flexbox (`min-height: 100vh`, `display: flex`, `align-items: center`, `justify-content: center`).

### 2.2 Visual Theme & Design System
- **Background**: Deep Slate (`#0F172A`) with subtle radial gradients (`#2563EB` blue glows).
- **Cards**: Dark glassmorphism (`rgba(30, 41, 59, 0.7)`, backdrop blur 20px, subtle 1px border `rgba(255, 255, 255, 0.1)`).
- **Typography**: System UI font stack with high-contrast white headers and muted slate body text.
- **Animations**: Keyframe scale-in and fade-in transitions.

### 2.3 Intro Screen Content Structure
1. **Header Pill**: `"Full-Stack Healthcare System"`
2. **Main Title**: `Salamat (سلامتك)` — Medical Appointment Management System
3. **Brief Description**: Multi-role medical appointment booking and administrative system for Patients, Doctors, and Hospital Admins.
4. **Developer Profile Card**:
   - Developer: **Amr Morcy**
   - GitHub: `@3mr-5aled`
5. **Tech Stack Badges**:
   - `React 18` | `TypeScript` | `Vite` | `TanStack Router` | `Node.js` | `Express` | `MongoDB` | `Mongoose` | `Playwright`

### 2.4 Outro Screen Content Structure
1. **Title**: `"Thank You for Watching!"`
2. **Subtitle**: `Salamat Medical Care Management System`
3. **Developer Credit**: Developed with ❤️ by Amr Morcy (`@3mr-5aled`)
4. **Repository Link**: `github.com/3mr-5aled/Salamat`

---

## 3. Recording Flow Fixes (`record-demo.mjs`)

### 3.1 Landing Page — Contact Section Sequence
- Scroll to `#emergency` (Emergency Hotline 19999).
- Smooth scroll directly into `#contact` (Hospital coordinates, WhatsApp, Facebook, working hours).
- Update HUD step label to reflect contact & emergency support accessibility.

### 3.2 Admin Portal — Messages Scope Clarification
- Update Scene 4.7 HUD text to clarify that Admin Messages originate exclusively from **Doctors** (facility support, equipment maintenance requests, schedule adjustments).
- Explicitly note that Patients contact hospital administration via Hotline, WhatsApp, or Facebook.

### 3.3 Admin Portal — Overview Review Before Quick Booking
- Insert a dedicated scroll and pause (~4 seconds) over the Admin Overview Dashboard stat cards (Total Clinics, Active Doctors, Registered Patients, Total Appointments) before launching the Quick Booking modal.

### 3.4 Admin Portal — Dashboard Load Synchronization
- Add `await page.waitForSelector(...)` for dashboard summary cards immediately following admin login, ensuring live API metrics are fully rendered before HUD display and recording.

---

## 4. Verification & Testing Criteria

1. **Build & Type Check**:
   - `npm run build --prefix frontend` continues to pass with 0 TypeScript/React errors.
2. **Script Execution**:
   - Running `node record-demo.mjs` successfully captures all scenes including Intro, Landing sequence, Admin load synchronization, Overview review, Doctor-only message HUD, and Outro.
