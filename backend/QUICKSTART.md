# API Quick Start Guide

## 🚀 Getting Started

This guide helps you get started with the Hospital Management API quickly.

## 📋 Prerequisites

- Node.js installed
- MongoDB running (local or Atlas)
- Postman or similar API testing tool
- Text editor

## 🔧 Setup in 5 Minutes

### 1. Clone and Install

```bash
git clone <repository-url>
cd hospital-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example config.env
```

Edit `config.env` with your settings (minimum required):

```env
PORT=8000
NODE_ENV=development
db_uri=mongodb://localhost:27017/hospital-db
JWT_SECRET_KEY=your-secret-key-min-32-chars
```

### 3. Start Server

```bash
npm run dev
```

Server should be running at `http://localhost:8000`

## 🎯 Testing the API

### Step 1: Register a User

**Endpoint**: `POST /api/v1/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "passwordConfirm": "Password123!",
  "role": "patient"
}
```

**Response**: You'll receive a JWT token in the response and as a cookie.

### Step 2: Login

**Endpoint**: `POST /api/v1/auth/login`

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response**: Save the `token` from the response.

### Step 3: Create Patient Profile

**Endpoint**: `POST /api/v1/patients`

**Headers**: `Authorization: Bearer YOUR_TOKEN`

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
  }
}
```

### Step 4: Browse Doctors

**Endpoint**: `GET /api/v1/doctors`

No authentication required for browsing.

**Query Parameters**:

- `specialty=Cardiology` - Filter by specialty
- `page=1&limit=10` - Pagination
- `sort=-rating` - Sort by rating (descending)

### Step 5: Book an Appointment

**Endpoint**: `POST /api/v1/appointments`

**Headers**: `Authorization: Bearer YOUR_TOKEN`

```json
{
  "doctor": "DOCTOR_ID",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:00",
  "reasonForVisit": "Regular checkup"
}
```

## 🔐 Authentication

### Using JWT Token

Add the token to your requests in one of two ways:

**1. Authorization Header** (Recommended)

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**2. Cookie** (Automatic if using browser)
The token is automatically set as an httpOnly cookie.

### Token Expiration

- Default expiration: 90 days
- Stored in: Cookie and response body
- Refresh: Login again when expired

## 🎨 Common Use Cases

### 1. Patient Flow

```
1. Signup → 2. Create Patient Profile → 3. Browse Doctors → 4. Book Appointment
```

### 2. Doctor Flow

```
1. Signup (Admin creates) → 2. Create Doctor Profile → 3. Set Availability → 4. Manage Appointments
```

### 3. Admin Flow

```
1. Login → 2. Manage Users → 3. Manage Clinics → 4. Oversee System
```

## 📊 Response Format

### Success Response

```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## 🔍 Query Features

### Pagination

```
GET /api/v1/patients?page=2&limit=20
```

### Filtering

```
GET /api/v1/doctors?specialty=Cardiology&experience[gte]=5
```

### Sorting

```
GET /api/v1/appointments?sort=-appointmentDate
```

### Field Selection

```
GET /api/v1/patients?fields=name,email,phone
```

### Search

```
GET /api/v1/doctors?keyword=heart
```

## 🛠️ Role-Based Access

### Public Routes (No Auth Required)

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/doctors`
- `GET /api/v1/clinics`

### Patient Routes

- All patient CRUD operations
- Create/view own appointments
- Update own profile

### Doctor Routes

- View assigned appointments
- Update appointment status
- Manage availability
- Update own profile

### Admin Routes

- All CRUD operations
- User management
- System configuration
- View all data

## ⚠️ Common Issues

### 1. "No token provided"

**Solution**: Add Authorization header or login to get a token

### 2. "Invalid token"

**Solution**: Token expired, login again

### 3. "Unauthorized"

**Solution**: Your role doesn't have permission for this action

### 4. "Database connection failed"

**Solution**: Check MongoDB is running and connection string is correct

### 5. "Validation error"

**Solution**: Check request body matches required format

## 📱 Testing with Postman

1. Import collection: `postman/Hospital-Management-API.postman_collection.json`
2. Import environment: `postman/Hospital-API-Development.postman_environment.json`
3. Set `baseUrl` variable to `http://localhost:8000/api/v1`
4. Run Authentication → Signup
5. Token is automatically saved to environment
6. Test other endpoints

## 🔗 Useful Links

- [Full README](README.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Postman Documentation](postman/README.md)

## 💡 Tips

1. **Always validate** input data before sending requests
2. **Use environment variables** in Postman for easy switching
3. **Check response status** codes for debugging
4. **Read error messages** carefully - they're descriptive
5. **Use pagination** for large data sets
6. **Test incrementally** - one endpoint at a time

## 🎓 Learning Resources

- [REST API Best Practices](https://restfulapi.net/)
- [MongoDB Queries](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [JWT Authentication](https://jwt.io/introduction)
- [Express.js Guide](https://expressjs.com/guide/)

---

**Need Help?** Open an issue or check existing documentation!
