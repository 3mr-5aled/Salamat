# Database Schema Documentation

## 📊 Overview

This document describes the database schema for the Hospital Management System API. The application uses MongoDB with Mongoose ODM.

## 🗄️ Collections

### 1. Users Collection

**Collection Name**: `users`

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'doctor', 'patient'], default: 'patient'),
  phone: String,
  profileImage: String,
  isActive: Boolean (default: true),
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `email` (unique)
- `role`

---

### 2. Patients Collection

**Collection Name**: `patients`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  dateOfBirth: Date (required),
  gender: String (enum: ['male', 'female'], required),
  bloodType: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String (required)
  },
  medicalHistory: {
    allergies: [String],
    chronicDiseases: [String],
    medications: [String],
    surgeries: [{
      name: String,
      date: Date,
      notes: String
    }]
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `user` (unique)
- `bloodType`
- `gender`

---

### 3. Doctors Collection

**Collection Name**: `doctors`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  specialty: String (required),
  qualifications: [String],
  experience: Number (years),
  licenseNumber: String (required, unique),
  clinic: ObjectId (ref: 'Clinic'),
  availability: [{
    day: String (enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    startTime: String,
    endTime: String,
    isAvailable: Boolean (default: true)
  }],
  consultationFee: Number,
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  bio: String,
  languages: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `user` (unique)
- `licenseNumber` (unique)
- `specialty`
- `clinic`

---

### 4. Clinics Collection

**Collection Name**: `clinics`

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  address: {
    street: String (required),
    city: String (required),
    state: String,
    zipCode: String,
    country: String (required)
  },
  contact: {
    phone: String (required),
    email: String,
    website: String
  },
  facilities: [String],
  operatingHours: {
    weekdays: {
      open: String,
      close: String
    },
    weekends: {
      open: String,
      close: String
    }
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `name` (unique)
- `address.city`
- `isActive`

---

### 5. Appointments Collection

**Collection Name**: `appointments`

```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: 'Patient', required),
  doctor: ObjectId (ref: 'Doctor', required),
  clinic: ObjectId (ref: 'Clinic'),
  appointmentDate: Date (required),
  appointmentTime: String (required),
  duration: Number (default: 30, minutes),
  status: String (enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'scheduled'),
  reasonForVisit: String (required),
  notes: String,
  diagnosis: String,
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  followUpDate: Date,
  cancelledBy: ObjectId (ref: 'User'),
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `patient`
- `doctor`
- `appointmentDate`
- `status`
- Compound index: `doctor` + `appointmentDate` + `appointmentTime`

---

## 🔗 Relationships

```
User (1) ──────────> (1) Patient
User (1) ──────────> (1) Doctor

Doctor (n) ────────> (1) Clinic

Appointment (n) ───> (1) Patient
Appointment (n) ───> (1) Doctor
Appointment (n) ───> (1) Clinic
```

## 📋 Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│─────────────│
│ _id         │
│ name        │
│ email       │◄─────┐
│ password    │      │
│ role        │      │ (1:1)
│ phone       │      │
└─────────────┘      │
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   Patients   │          │   Doctors    │
│──────────────│          │──────────────│
│ _id          │          │ _id          │
│ user         │          │ user         │
│ dateOfBirth  │          │ specialty    │
│ gender       │          │ licenseNo    │
│ bloodType    │          │ clinic       │───┐
│ address      │          │ availability │   │
│ medicalHist  │          │ consultFee   │   │
└──────┬───────┘          └──────┬───────┘   │
       │                         │            │
       │ (n)            (n)      │            │
       │                         │            │
       └────────┬────────────────┘            │
                │                             │
                ▼                             │
        ┌───────────────┐                    │
        │ Appointments  │                    │
        │───────────────│                    │
        │ _id           │                    │
        │ patient       │                    │
        │ doctor        │                    │
        │ clinic        │◄───────────────────┘
        │ date          │            (n:1)
        │ time          │
        │ status        │            ┌──────────────┐
        │ diagnosis     │            │   Clinics    │
        │ prescription  │            │──────────────│
        └───────────────┘            │ _id          │
                                     │ name         │
                                     │ address      │
                                     │ contact      │
                                     │ facilities   │
                                     └──────────────┘
```

## 🔑 Key Design Decisions

### 1. User Role Separation

- Single `users` collection for authentication
- Separate `patients` and `doctors` collections for role-specific data
- Enables flexible role management and data segregation

### 2. Embedded vs Referenced Documents

- **Embedded**: Address, emergency contacts, medical history (rarely queried independently)
- **Referenced**: User relationships, appointments (frequently queried and updated)

### 3. Appointment Conflicts Prevention

- Compound index on `doctor + date + time` ensures no double-booking
- Application-level validation for appointment slots

### 4. Soft Deletes

- `isActive` flags instead of hard deletes
- Maintains data integrity and audit trails

### 5. Timestamps

- Automatic `createdAt` and `updatedAt` via Mongoose timestamps
- Essential for auditing and tracking changes

## 📝 Common Queries

### Find Available Doctors by Specialty

```javascript
Doctor.find({
  specialty: "Cardiology",
  "availability.isAvailable": true,
}).populate("user clinic");
```

### Get Patient's Appointment History

```javascript
Appointment.find({ patient: patientId })
  .populate("doctor clinic")
  .sort({ appointmentDate: -1 });
```

### Check Doctor Availability

```javascript
Appointment.find({
  doctor: doctorId,
  appointmentDate: date,
  appointmentTime: time,
  status: { $nin: ["cancelled", "no-show"] },
});
```

## 🔒 Security Considerations

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **Sensitive Data**: Medical history and insurance encrypted at rest
3. **Access Control**: Role-based permissions enforced at API level
4. **Audit Logging**: All modifications tracked with timestamps
5. **Data Privacy**: HIPAA-compliant data handling practices

## 📈 Performance Optimization

1. **Indexes**: Strategic indexing on frequently queried fields
2. **Pagination**: Implemented for large result sets
3. **Population**: Selective field population to reduce payload
4. **Caching**: Consider Redis for frequently accessed data
5. **Aggregation**: Pipeline optimization for complex queries

---

**Last Updated**: January 31, 2026
