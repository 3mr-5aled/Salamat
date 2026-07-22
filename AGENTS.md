# AGENTS.md — Salamat Medical Appointment System

This file documents the repository structure, conventions, and behavioral guidelines for AI agents working on this codebase.

---

## Project Overview

**Salamat** is a full-stack medical appointment management system serving three user roles:

| Role | Description |
|------|-------------|
| `patient` | Books appointments, views prescriptions, tracks registrations |
| `doctor` | Manages consultation hours, reviews patient bookings, writes prescriptions |
| `admin` | Oversees clinics, doctors, patients, slots, and reads doctor messages |

---

## Repository Structure

```
Salamat/
├── frontend/          # React + TypeScript (Vite + TanStack Router)
│   └── src/
│       ├── routes/    # Page-level components (one file = one route)
│       ├── services/  # Axios API wrappers (one file = one domain)
│       ├── components/
│       │   ├── ui/    # Primitive UI components (Button, Card, Input, etc.)
│       │   └── MedicalNotesDisplay.tsx  # JSON-aware prescription renderer
│       ├── contexts/  # React Context providers (AuthContext)
│       └── lib/       # Shared utilities
│
└── backend/           # Node.js + Express + MongoDB (Mongoose)
    └── src/
        ├── routes/         # Express routers (mounted under /api/v1)
        ├── controllers/    # Request handlers
        ├── models/         # Mongoose schemas
        ├── services/       # Business logic layer
        ├── middlewares/    # Auth, error handling, etc.
        ├── validators/     # express-validator rule chains
        └── utils/          # Shared helpers (email, logger, etc.)
```

---

## Running the Project

```bash
# From the project root — starts both frontend and backend concurrently
npm run dev

# Frontend only (http://localhost:5173)
npm run dev --prefix frontend

# Backend only (http://localhost:8000)
npm run dev --prefix backend
```

### Build & Type-Check

```bash
# Must pass with zero errors before any PR / commit
npm run build --prefix frontend
```

> Always run `npm run build --prefix frontend` after making TypeScript changes. Never leave failing type errors.

---

## Frontend Conventions

### Routing
- Uses **TanStack Router** with file-based route objects.
- All routes are defined in `frontend/src/routes/`. Each file exports a `Route` object via `createRoute()`.
- The root layout is `__root.tsx` — do not restructure it.

### State Management
- **Local `useState`** for page-scoped state (forms, modals, filters).
- **`AuthContext`** (`contexts/AuthContext.tsx`) for session-wide auth state (`user`, `isAuthenticated`, `loading`).
- No Redux or Zustand — keep state local unless it needs to cross component boundaries.

### UI Components
- Use components from `components/ui/` (`Button`, `Card`, `Input`, `Label`, `DatePicker`).
- Do **not** use `<input>` or `<button>` bare elements when a styled `<Input>` / `<Button>` wrapper exists.
- Styling is **Vanilla CSS + Tailwind-style class strings** (the project predates Tailwind but uses its class patterns via the same conventions).
- Color palette: `#2563EB` (primary blue), `#0F172A` (near-black), `#64748B` (muted), `#16A34A` (success), `#F59E0B` (warning), red-500 (danger).

### MedicalNotesDisplay
- `components/MedicalNotesDisplay.tsx` is the **only** place where raw JSON note strings should be parsed and rendered.
- Always pass the raw string to `<MedicalNotesDisplay notes={...} />` — never inline `JSON.parse` inside a route for display purposes.
- Accepts a `compact` prop (`boolean`) for list-mode vs. full-page rendering.

### API Service Layer
- All HTTP calls go through `services/api.ts` (Axios instance auto-attaching the JWT).
- Domain services: `auth.ts`, `appointment.ts`, `clinic.ts`, `doctor.ts`, `patient.ts`.
- **Never call `axios` directly** in a route or component. Import from the service layer.

---

## Backend Conventions

### API Base URL
```
http://localhost:8000/api/v1
```

### Route Mount Points
| Prefix | Router file |
|--------|-------------|
| `/auth` | `auth.routes.js` |
| `/appointments` | `appointment.routes.js` |
| `/clinics` | `clinic.routes.js` |
| `/doctors` | `doctor.routes.js` |
| `/patients` | `patient.routes.js` |

### Auth Middleware
- `protect` — validates JWT, attaches `req.user`.
- `allowedTo(...roles)` — restricts route to specific roles.
- Always apply both in this order: `protect` first, then `allowedTo`.

### Models Summary
| Model | File | Purpose |
|-------|------|---------|
| `User` | `user.model.js` | Auth identity (email, password, role) |
| `Doctor` | `doctor.model.js` | Doctor profile (linked to `User`) |
| `Patient` | `patient.model.js` | Patient profile (linked to `User`) |
| `Clinic` | `clinic.model.js` | Clinic entity |
| `ClinicSession` | `clinicSession.model.js` | A timed consultation block created by a doctor |
| `Appointment` | `appointment.model.js` | Individual patient booking within a session |
| `AdminMessage` | `adminMessage.model.js` | Messages sent to admin via Contact Admin form |

### Appointments Architecture
- A **ClinicSession** represents an entire consultation block (start time, end time, duration per patient, doctor, clinic, date).
- Individual **Appointments** are generated per patient by `appointmentService.bookSessionAppointment()`.
- Slot times are calculated dynamically from `session.startTime + (slotIndex * appointmentDuration)`.
- Do not add raw `time` fields to the DB — compute them from session data.

### Error Handling
- Use `ApiError` from `utils/` to throw structured errors.
- All controllers should be wrapped in `asyncHandler` (from `express-async-handler`).
- The global error handler in `middlewares/` catches `ApiError` and formats the response.

---

## Agent Behavioral Guidelines

### Scope
- **Do not** redesign the application UI or restructure the route tree.
- **Do not** perform large-scale refactoring unrelated to the task at hand.
- **Do not** modify unrelated APIs, models, or services.
- Keep changes minimal and localized to the files relevant to the task.

### TypeScript
- Ensure all edits leave the codebase in a state that passes `npm run build --prefix frontend` with zero type errors.
- Use `any` sparingly — only for dynamic API response shapes where no interface exists yet.
- Do not leave unused imports (TypeScript strict mode will catch these).

### Styling
- Match existing class patterns. Do not introduce Tailwind utilities that haven't already been used in the file.
- Never inline `style={{}}` unless it's a truly dynamic value (e.g., a CSS variable or calculated width).

### Modals & Dialogs
- All feedback (success/error) for dialog-initiated actions must appear **inside** the dialog — not in the parent layout's toast or banner area.
- State for dialog feedback should be local to the component and cleared when the dialog is closed or cancelled.

### Medical Data
- Patient medical notes/symptoms are stored as JSON strings in the DB (`booking.notes` or `booking.symptoms`).
- Always detect JSON (`str.trim().startsWith('{')`) before parsing. Fall back to plain-text rendering.
- Never expose raw JSON strings directly in the UI.

### Backend Changes
- When adding a new endpoint, always:
  1. Create or update the model (if new data is stored).
  2. Add the controller function.
  3. Register the route in the appropriate routes file.
  4. Apply correct `protect` + `allowedTo` middleware.

### Testing
- Tests live alongside their source files (e.g., `admin.test.tsx`, `services.test.ts`).
- Run `npm run build --prefix frontend` as the primary sanity check — the test suite is secondary.
- Do not break existing test file imports when renaming or moving things.

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_PORT` | `frontend/.env` | Backend port for the Axios base URL (default: `8000`) |
| `JWT_SECRET_KEY` | `backend/.env` | JWT signing secret |
| `MONGO_URI` | `backend/.env` | MongoDB connection string |
| `ADMIN_EMAIL` | `backend/.env` | Destination for Contact Admin emails |
| `NODE_ENV` | `backend/.env` | `development` or `production` |

> Do not hard-code secrets. Always read from `process.env` or `import.meta.env`.
