# Design Spec: Patient Portal Support & Emergency Hotline View

**Date**: 2026-08-12  
**Author**: Amr Morcy (@3mr-5aled) & Antigravity Assistant  
**Target File**: `frontend/src/components/patient/PatientTabs.tsx`  

---

## 1. Overview & Objective

Add a dedicated **Hospital Support & Emergency Hotline** section into the Patient Portal Overview tab. This gives logged-in patients immediate access to emergency support (`19999`) and hospital contact channels (WhatsApp, Facebook, Phone lines, and Address/Hours) without leaving their dashboard.

---

## 2. Component Design & Layout

### 2.1 Emergency Hotline Banner
- **Container**: Rounded 3xl card with a bold red background (`bg-[#DC2626]`), shadow effects, and white contrast typography.
- **Icon**: `PhoneCall` with subtle bounce/pulse micro-animation.
- **Headline**: `"24/7 Emergency Assistance"`
- **Subtext**: `"Our emergency response coordinators and medical staff are on standby 24/7."`
- **Call Button**: Styled `a[href="tel:19999"]` button (`bg-white text-[#DC2626] hover:bg-red-50 font-bold`).

### 2.2 Direct Support Channels Grid
- **WhatsApp Card**: Link to `https://wa.me/201234567890` with green accent (`#25D366`), title, phone number, and `"Message us →"` link.
- **Facebook Card**: Link to `https://facebook.com/salamathospital` with blue accent (`#1877F2`), page handle, and `"Visit page →"` link.
- **Phone Support Card**: Hospital landline `+20 (2) 2345 6789` and mobile support `+20 100 234 5678`.
- **Hospital Address & Hours Card**:
  - Address: `123 El-Nasr St, Maadi, Cairo Governorate, Egypt`
  - Working Hours: Outpatient (8:00 AM - 10:00 PM) | Emergency Ward (24/7)

---

## 3. Placement

Inserted directly into `frontend/src/components/patient/PatientTabs.tsx` inside the `activeTab === "overview"` render block right after the Quick Action Cards.

---

## 4. Verification Criteria

1. **Build & Type Check**: `npm run build --prefix frontend` passes with 0 errors.
2. **Visual & Behavioral Verification**:
   - Patient Overview tab displays Emergency banner and Support cards.
   - Clicking Hotline opens telephone handler (`tel:19999`).
   - WhatsApp and Facebook links open external tabs safely (`target="_blank" rel="noopener noreferrer"`).
