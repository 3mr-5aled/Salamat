# Hospital API - Postman Testing Suite

This directory contains comprehensive Postman collections and automated testing scripts for the Hospital Management API.

## 📁 Files Overview

### Collections

- `Hospital-Management-API.postman_collection.json` - Complete API collection with all endpoints
- `Hospital-API-TestSuite.postman_collection.json` - Automated test suite with validation scripts

### Environments

- `environments/Hospital-API-Development.postman_environment.json` - Development environment variables
- `environments/Hospital-API-Staging.postman_environment.json` - Staging environment variables
- `environments/Hospital-API-Production.postman_environment.json` - Production environment variables

### Test Automation

- `run-tests.js` - Newman test runner with detailed reporting
- `package.json` - Dependencies and npm scripts for testing

## 🚀 Quick Start

### 1. Import Collections to Postman

1. Open Postman
2. Click "Import" button
3. Select `Hospital-Management-API.postman_collection.json`
4. Import the appropriate environment file for your setup

### 2. Set Up Environment

1. Select the imported environment in Postman
2. Update the following variables:
   - `baseUrl` - Your API server URL (default: http://localhost:3000/api/v1)
   - `adminEmail` - Admin user email
   - `adminPassword` - Admin user password

### 3. Test the API

- Start with the **Authentication** folder to get your JWT token
- Use the token for protected endpoints
- Follow the folder structure for organized testing

## 🔧 Automated Testing Setup

### Installation

```bash
# Install Newman (Postman CLI)
npm install -g newman

# Or install locally in this directory
npm install
```

### Running Tests

#### Using npm scripts (recommended):

```bash
# Run full test suite with detailed reporting
npm test

# Run tests for specific environments
npm run test:dev      # Development environment
npm run test:staging  # Staging environment
npm run test:prod     # Production environment

# CI/CD friendly (fails fast, JSON output)
npm run test:ci

# Test main collection
npm run test:collection
```

#### Using Newman directly:

```bash
# Basic test run
newman run Hospital-API-TestSuite.postman_collection.json -e environments/Hospital-API-Development.postman_environment.json

# With HTML report
newman run Hospital-API-TestSuite.postman_collection.json -e environments/Hospital-API-Development.postman_environment.json --reporters cli,html --reporter-html-export test-results/report.html
```

### Using the Node.js test runner:

```bash
# Run with custom configuration
node run-tests.js
```

## 📋 Test Suite Features

### 🧪 Comprehensive Testing

- **Authentication Tests** - User registration, login, token validation
- **CRUD Operations** - Create, Read, Update, Delete for all entities
- **Data Validation** - Request/response schema validation
- **Error Handling** - Testing error scenarios and edge cases
- **Automated Cleanup** - Removes test data after execution

### 📊 Test Scenarios Covered

1. **Setup Tests**
   - Admin user creation and authentication
   - Token generation and validation

2. **Clinic Management**
   - Create, update, delete clinics
   - Clinic information retrieval

3. **Doctor Management**
   - Doctor registration and profile management
   - Specialization and clinic assignments

4. **Patient Management**
   - Patient registration and profile updates
   - Medical history management

5. **Appointment Types**
   - Service type definitions
   - Pricing and duration settings

6. **Appointment Booking**
   - Appointment creation and scheduling
   - Patient registration for appointments
   - Status management

7. **Cleanup Operations**
   - Automated test data removal
   - Database cleanup verification

## 📈 Test Reports

After running tests, reports are generated in the `test-results/` directory:

- `newman-report.html` - Detailed HTML report with visual charts
- `newman-report.json` - Machine-readable JSON report for CI/CD
- Environment-specific reports for different test runs

## 🔐 Environment Variables

### Required Variables

```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "adminEmail": "admin@hospital.com",
  "adminPassword": "admin123456"
}
```

### Auto-Generated Variables

The test suite automatically creates and manages:

- `token` - JWT authentication token
- `testClinicId` - Created test clinic ID
- `testDoctorId` - Created test doctor ID
- `testPatientId` - Created test patient ID
- `testAppointmentId` - Created test appointment ID
- `testAppointmentTypeId` - Created appointment type ID

## 🏗️ CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16"
      - run: cd postman && npm install
      - run: cd postman && npm run test:ci
```

### Jenkins Example

```groovy
pipeline {
  agent any
  stages {
    stage('API Tests') {
      steps {
        dir('postman') {
          sh 'npm install'
          sh 'npm run test:ci'
        }
      }
    }
  }
  post {
    always {
      publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'postman/test-results',
        reportFiles: 'newman-report.html',
        reportName: 'API Test Report'
      ])
    }
  }
}
```

## 🛠️ Customization

### Adding New Tests

1. Open the test suite collection in Postman
2. Add new requests to appropriate folders
3. Add test scripts in the "Tests" tab
4. Export the updated collection

### Modifying Test Data

Edit the request bodies in the collection to match your test requirements:

- Update user credentials
- Modify clinic/doctor/patient information
- Adjust appointment scheduling data

### Custom Assertions

Add custom test assertions in the "Tests" tab of each request:

```javascript
pm.test("Custom validation", function () {
  const response = pm.response.json();
  pm.expect(response.data.customField).to.exist;
});
```

## 📞 Support

For issues with the testing setup:

1. Check the console output for detailed error messages
2. Verify environment variables are correctly set
3. Ensure the API server is running and accessible
4. Review the generated HTML reports for test failures

## 🔄 Updates

Keep your collections updated:

1. Re-export collections when API endpoints change
2. Update environment variables for new deployments
3. Refresh test data and assertions as needed

---

**Happy Testing!** 🎉
