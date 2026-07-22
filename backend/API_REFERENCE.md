# API Documentation

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Or use cookie-based authentication (automatically handled by browser).

---

## Response Format

### Success Response

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "resourceName": [...]
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "passwordConfirm": "Password123!",
  "role": "patient"
}
```

**Response:** `201 Created`

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    }
  }
}
```

### Login

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    }
  }
}
```

### Logout

**GET** `/auth/logout`

**Auth Required:** Yes

Logout user and clear authentication cookie.

**Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Forgot Password

**POST** `/auth/forgotPassword`

Request password reset email.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Password reset link sent to email"
}
```

### Reset Password

**PUT** `/auth/resetPassword/:token`

Reset password using token from email.

**Request Body:**

```json
{
  "password": "NewPassword123!",
  "passwordConfirm": "NewPassword123!"
}
```

**Response:** `200 OK`

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Password reset successful"
}
```

---

## Patient Endpoints

### Get All Patients

**GET** `/patients`

**Auth Required:** Yes (Admin/Doctor)

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `sort` - Sort field (e.g., `-createdAt`)
- `fields` - Select specific fields
- `keyword` - Search keyword
- `gender` - Filter by gender
- `bloodType` - Filter by blood type

**Response:** `200 OK`

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "patients": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "dateOfBirth": "1990-01-15",
        "gender": "male",
        "bloodType": "A+",
        "createdAt": "2026-01-31T10:00:00.000Z"
      }
    ]
  }
}
```

### Get Patient by ID

**GET** `/patients/:id`

**Auth Required:** Yes

**Response:** `200 OK`

### Create Patient Profile

**POST** `/patients`

**Auth Required:** Yes (Patient role)

**Request Body:**

```json
{
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bloodType": "A+",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890"
  },
  "medicalHistory": {
    "allergies": ["Penicillin"],
    "chronicDiseases": ["Diabetes"],
    "medications": ["Metformin"]
  }
}
```

**Response:** `201 Created`

### Update Patient

**PUT** `/patients/:id`

**Auth Required:** Yes (Own profile or Admin)

### Delete Patient

**DELETE** `/patients/:id`

**Auth Required:** Yes (Admin only)

---

## Doctor Endpoints

### Get All Doctors

**GET** `/doctors`

**Auth Required:** No

**Query Parameters:**

- `specialty` - Filter by specialty
- `experience[gte]` - Minimum years of experience
- `rating[gte]` - Minimum rating
- `sort` - Sort field (e.g., `-rating`)

**Response:** `200 OK`

### Get Doctor by ID

**GET** `/doctors/:id`

**Auth Required:** No

### Create Doctor Profile

**POST** `/doctors`

**Auth Required:** Yes (Admin only)

**Request Body:**

```json
{
  "user": "507f1f77bcf86cd799439011",
  "specialty": "Cardiology",
  "qualifications": ["MD", "FACC"],
  "experience": 10,
  "licenseNumber": "DOC12345",
  "clinic": "507f1f77bcf86cd799439012",
  "availability": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ],
  "consultationFee": 150,
  "bio": "Experienced cardiologist...",
  "languages": ["English", "Spanish"]
}
```

**Response:** `201 Created`

### Update Doctor

**PUT** `/doctors/:id`

**Auth Required:** Yes (Own profile or Admin)

### Delete Doctor

**DELETE** `/doctors/:id`

**Auth Required:** Yes (Admin only)

---

## Clinic Endpoints

### Get All Clinics

**GET** `/clinics`

**Auth Required:** No

### Get Clinic by ID

**GET** `/clinics/:id`

**Auth Required:** No

### Create Clinic

**POST** `/clinics`

**Auth Required:** Yes (Admin only)

**Request Body:**

```json
{
  "name": "City Medical Center",
  "description": "Full-service medical facility",
  "address": {
    "street": "456 Health Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002",
    "country": "USA"
  },
  "contact": {
    "phone": "+1234567890",
    "email": "info@citymedical.com",
    "website": "https://citymedical.com"
  },
  "facilities": ["Emergency", "Surgery", "ICU"],
  "operatingHours": {
    "weekdays": {
      "open": "08:00",
      "close": "20:00"
    },
    "weekends": {
      "open": "09:00",
      "close": "18:00"
    }
  }
}
```

**Response:** `201 Created`

### Update Clinic

**PUT** `/clinics/:id`

**Auth Required:** Yes (Admin only)

### Delete Clinic

**DELETE** `/clinics/:id`

**Auth Required:** Yes (Admin only)

---

## Appointment Endpoints

### Get All Appointments

**GET** `/appointments`

**Auth Required:** Yes

**Query Parameters:**

- `status` - Filter by status
- `doctor` - Filter by doctor ID
- `patient` - Filter by patient ID
- `appointmentDate[gte]` - Filter by date
- `sort` - Sort field

**Response:** `200 OK`

### Get Appointment by ID

**GET** `/appointments/:id`

**Auth Required:** Yes

### Create Appointment

**POST** `/appointments`

**Auth Required:** Yes (Patient role)

**Request Body:**

```json
{
  "doctor": "507f1f77bcf86cd799439011",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:00",
  "duration": 30,
  "reasonForVisit": "Regular checkup",
  "notes": "First visit"
}
```

**Response:** `201 Created`

**Validation:**

- Doctor must exist and be available
- Time slot must not be already booked
- Appointment must be in the future
- Doctor must be available on that day/time

### Update Appointment

**PUT** `/appointments/:id`

**Auth Required:** Yes (Patient/Doctor/Admin)

**Request Body:**

```json
{
  "status": "confirmed",
  "diagnosis": "Healthy",
  "prescription": [
    {
      "medication": "Aspirin",
      "dosage": "100mg",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ]
}
```

**Response:** `200 OK`

### Cancel Appointment

**DELETE** `/appointments/:id`

**Auth Required:** Yes (Patient/Doctor/Admin)

**Response:** `200 OK`

---

## Query Features

### Pagination

```
GET /patients?page=2&limit=20
```

### Filtering

```
GET /doctors?specialty=Cardiology&experience[gte]=5
```

### Sorting

```
GET /appointments?sort=-appointmentDate
```

Prefix with `-` for descending order.

### Field Selection

```
GET /patients?fields=name,email,phone
```

### Search

```
GET /doctors?keyword=heart
```

Searches across multiple fields.

---

## Error Codes

| Status Code | Meaning                                  |
| ----------- | ---------------------------------------- |
| 200         | OK - Request successful                  |
| 201         | Created - Resource created               |
| 400         | Bad Request - Invalid input              |
| 401         | Unauthorized - Not authenticated         |
| 403         | Forbidden - Insufficient permissions     |
| 404         | Not Found - Resource not found           |
| 409         | Conflict - Duplicate resource            |
| 422         | Unprocessable Entity - Validation failed |
| 429         | Too Many Requests - Rate limit exceeded  |
| 500         | Internal Server Error                    |

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining`
- **Response:** `429 Too Many Requests`

---

## Security Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

---

## Testing

Use the Postman collection in `postman/` directory for comprehensive API testing.

```bash
cd postman
npm install
npm test
```

---

**Last Updated**: January 31, 2026
