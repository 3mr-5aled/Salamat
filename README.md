<div align="center">

<img src="frontend/src/assets/app-logo-transparent.png" alt="Salamat Hospital Logo" width="180" />

# 🏥 Salamat Medical System

**An Enterprise-Grade, Full-Stack Healthcare Appointment & Clinical Management Ecosystem**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OWASP Hardened](https://img.shields.io/badge/OWASP-Hardened-blue?style=for-the-badge&logo=shield)](docs/PRODUCTION_AUDIT_REPORT.md)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Demo Video](#-system-demo-video)
- [System Architecture](#-system-architecture)
- [Key Features by User Role](#-key-features-by-user-role)
- [UI Screenshots](#-ui-screenshots)
- [OWASP Security & Hardening](#-owasp-security--hardening)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Database Seeding](#-database-seeding)
- [Production Deployment](#-production-deployment)
- [License](#-license)

---

## 🌟 Overview

**Salamat** (سلامات) is a modern, full-stack medical appointment management platform engineered to connect patients with board-certified healthcare providers and hospital management.

Designed around a **3-tier role hierarchy** (`Patient`, `Doctor`, `Admin`), Salamat provides real-time specialist discovery, dynamic conflict-free slot scheduling, clinical consultation management, and paperless digital prescription rendering.

---

## 🎥 System Demo Video

<div align="center">

![System Walkthrough Demo](docs/videos/demo.gif)

*Watch a full walkthrough of the Salamat Medical System including Patient booking, Doctor workstation, and Admin panel.*

</div>

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client Layer
        P[Patient Portal - React / TanStack Router]
        D[Doctor Workstation - React]
        A[Admin Panel - React]
    end

    subgraph Service & Security Layer
        GW[Nginx / Express Router /api/v1]
        SEC[Helmet + CORS + Rate Limiting + HPP]
        AUTH[JWT Protect & Role RBAC Middleware]
    end

    subgraph Business Logic Layer
        AS[Appointment & Slot Engine]
        AUTH_S[Auth & User Service]
        CLINIC_S[Clinic & Doctor Service]
    end

    subgraph Database Layer
        DB[(MongoDB Cluster)]
    end

    P --> GW
    D --> GW
    A --> GW
    GW --> SEC
    SEC --> AUTH
    AUTH --> AS
    AUTH --> AUTH_S
    AUTH --> CLINIC_S
    AS --> DB
    AUTH_S --> DB
    CLINIC_S --> DB
```

---

## 👥 Key Features by User Role

### 👨‍👩‍👧‍👦 1. Patient Portal
- **Specialty & Doctor Discovery**: Instant dynamic filtering by medical department and physician availability.
- **Smart Conflict-Free Booking**: Dynamic session time-offset algorithm preventing double bookings.
- **Digital Prescription Hub**: Authenticated view and print options for medical prescriptions powered by `<MedicalNotesDisplay />`.

### 📋 2. Doctor Workstation
- **Clinical Consultation Drawer**: Record clinical diagnosis, prescribe structured medications, and log internal records.
- **Shift & Hours Management**: Live schedule grid with instant emergency shift cancellation.
- **Direct Admin Inquiry**: Submit maintenance and clinic requests directly to hospital administration.

### 🛡️ 3. Admin Control Panel
- **Real-Time System Metrics**: High-level overview of total clinics, doctors, registered patients, and appointment metrics.
- **Facility Allocation**: Assign doctors to clinic rooms and manage walk-in patient registrations.
- **Medical Staff Messaging Inbox**: Centralized message management for doctor inquiries.

---

## 📸 UI Screenshots

<div align="center">

### 1. Landing Page & Ecosystem
![Landing Page](docs/screenshots/landing_page.png)

### 2. Patient Portal & Booking Engine
![Patient Portal](docs/screenshots/patient_dashboard.png)

### 3. Doctor Clinical Workstation
![Doctor Workstation](docs/screenshots/doctor_workstation.png)

### 4. Admin Control Panel
![Admin Panel](docs/screenshots/admin_panel.png)

</div>

---

## 🔒 OWASP Security & Hardening

Salamat implements strict security controls audited against **OWASP Top 10** standards:

| Control Area | Implementation |
|--------------|----------------|
| **HTTP Security Headers** | `helmet()` enabled for HSTS, Content Security Policy, and Frame Protection. |
| **Authentication & Auth** | JWT stateless bearer token validation with role-based guard middleware (`protect`, `allowedTo`). |
| **Password Storage** | Cryptographically salted hashes powered by `bcryptjs` (12 rounds). |
| **Rate Limiting** | `express-rate-limit` restricting IPs to 100 requests per 15-min window on API routes. |
| **Parameter Pollution** | `hpp` whitelist validation enforcing payload parameters. |
| **Data Sanitization** | `express-validator` schema validation and strict Mongoose schema casting. |

---

## 🔌 API Reference

Full API endpoints mounted under `/api/v1`:

| Module | Endpoint | Method | Role Access |
|--------|----------|--------|-------------|
| **Auth** | `/api/v1/auth/signup` | `POST` | Public |
| **Auth** | `/api/v1/auth/login` | `POST` | Public |
| **Auth** | `/api/v1/auth/me` | `GET` | Authenticated |
| **Appointments** | `/api/v1/appointments/available-slots` | `GET` | Authenticated |
| **Appointments** | `/api/v1/appointments/book` | `POST` | Patient |
| **Doctors** | `/api/v1/doctors` | `GET` | Public |
| **Clinics** | `/api/v1/clinics` | `GET` | Public |
| **Admin** | `/api/v1/auth/admin-messages` | `GET` | Admin |

For complete documentation, see [`backend/API_REFERENCE.md`](backend/API_REFERENCE.md).

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/3mr-5aled/Salamat.git
cd Salamat
```

### 2. Install Dependencies
```bash
# Root concurrent installation
npm install
npm run install:all
```

### 3. Start Development Servers
```bash
# Starts both frontend (http://localhost:5173) and backend (http://localhost:8000)
npm run dev
```

---

## 🌱 Database Seeding

Populate the database with demo clinics, specialists, and patients:

```bash
npm run seed --prefix backend
npm run seed:all --prefix backend
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Patient** | `mohamed@salamat.com` | `PatientPassword123` |
| **Doctor** | `dr.ahmed@salamat.com` | `DoctorPassword123` |
| **Admin** | `admin@salamat.com` | `AdminPassword123` |

---

## 🌐 Production Deployment

Refer to [`DEPLOYMENT.md`](DEPLOYMENT.md) for full deployment setup with Docker Compose, PM2, Nginx, SSL Certbot, and MongoDB Atlas.

---

## 📄 License

This project is licensed under the ISC License.
