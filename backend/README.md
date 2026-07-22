<div align="center">
  <img src="./public/hospital-api-banner.png" alt="Hospital-API Backend Service" width="100%">
</div>

# Hospital Management System API

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D4.4-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.17-lightgrey.svg)](https://expressjs.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint: Airbnb](https://img.shields.io/badge/eslint-airbnb-blue.svg)](https://github.com/airbnb/javascript)

A comprehensive RESTful API for hospital management built with Node.js, Express.js, and MongoDB. This system provides complete functionality for appointment booking, patient management, and administrative features.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#️-installation)
- [Project Structure](#-project-structure)
- [API Endpoints](#️-api-endpoints)
- [Documentation](#-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🏥 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Doctor, Patient)
  - Password reset functionality
  - Secure cookie handling

- **Patient Management**
  - Patient registration and profiles
  - Medical history tracking
  - Appointment scheduling

- **Doctor Management**
  - Doctor profiles and specializations
  - Availability management
  - Appointment handling

- **Administrative Features**
  - User management
  - System monitoring
  - Data analytics

- **Security Features**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - HPP protection
  - Input validation and sanitization

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Sharp for image processing
- **Email**: Nodemailer for email notifications
- **Validation**: Express Validator
- **Security**: Helmet, CORS, HPP, Rate Limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/3mr-5aled/hospital-api.git
   cd hospital-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example config.env
   ```

   Edit `config.env` with your settings:

   ```env
   NODE_ENV=development
   PORT=8000

   # Database
   db_uri=mongodb://localhost:27017/hospital-db
   # Or use MongoDB Atlas
   # db_uri=mongodb+srv://username:password@cluster.mongodb.net/database

   # JWT
   JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRE_TIME=90d

   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password

   # Other configurations
   BASE_URL=http://localhost:8000
   ```

   > ⚠️ **Security**: Never commit `config.env` to version control. Use `.env.example` as a template.

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud database)
   ```

5. **Start the application**

   **Development mode:**

   ```bash
   npm run dev
   ```

   **Production mode:**

   ```bash
   npm run start:prod
   ```

## 📁 Project Structure

```
hospital-api/
├── src/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middleware functions
│   ├── models/         # Mongoose models (User, Patient, Doctor, etc.)
│   ├── routes/         # Express routes
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions (errors, helpers, email)
│   └── validators/     # Input validation schemas
├── postman/            # Postman collections and test suites
├── uploads/            # File upload directory
├── server.js           # Application entry point
├── config.env          # Environment variables (DO NOT COMMIT)
├── .env.example        # Environment template
├── package.json        # Project dependencies
├── DATABASE_SCHEMA.md  # Database schema documentation
└── README.md           # Project documentation
```

For detailed database schema information, see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run start:prod` - Start production server with NODE_ENV=production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🛣️ API Endpoints

### Authentication

| Method | Endpoint                            | Description            | Auth Required |
| ------ | ----------------------------------- | ---------------------- | ------------- |
| POST   | `/api/v1/auth/signup`               | Register new user      | No            |
| POST   | `/api/v1/auth/login`                | Login user             | No            |
| POST   | `/api/v1/auth/forgotPassword`       | Request password reset | No            |
| PUT    | `/api/v1/auth/resetPassword/:token` | Reset password         | No            |

### Patients

| Method | Endpoint               | Description            | Auth Required |
| ------ | ---------------------- | ---------------------- | ------------- |
| GET    | `/api/v1/patients`     | Get all patients       | Admin/Doctor  |
| GET    | `/api/v1/patients/:id` | Get patient by ID      | Yes           |
| POST   | `/api/v1/patients`     | Create patient profile | Patient       |
| PUT    | `/api/v1/patients/:id` | Update patient         | Patient       |
| DELETE | `/api/v1/patients/:id` | Delete patient         | Admin         |

### Doctors

| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| GET    | `/api/v1/doctors`     | Get all doctors       | No            |
| GET    | `/api/v1/doctors/:id` | Get doctor by ID      | No            |
| POST   | `/api/v1/doctors`     | Create doctor profile | Admin         |
| PUT    | `/api/v1/doctors/:id` | Update doctor         | Doctor/Admin  |
| DELETE | `/api/v1/doctors/:id` | Delete doctor         | Admin         |

### Clinics

| Method | Endpoint              | Description      | Auth Required |
| ------ | --------------------- | ---------------- | ------------- |
| GET    | `/api/v1/clinics`     | Get all clinics  | No            |
| GET    | `/api/v1/clinics/:id` | Get clinic by ID | No            |
| POST   | `/api/v1/clinics`     | Create clinic    | Admin         |
| PUT    | `/api/v1/clinics/:id` | Update clinic    | Admin         |
| DELETE | `/api/v1/clinics/:id` | Delete clinic    | Admin         |

### Appointments

| Method | Endpoint                   | Description           | Auth Required        |
| ------ | -------------------------- | --------------------- | -------------------- |
| GET    | `/api/v1/appointments`     | Get appointments      | Yes                  |
| GET    | `/api/v1/appointments/:id` | Get appointment by ID | Yes                  |
| POST   | `/api/v1/appointments`     | Create appointment    | Patient              |
| PUT    | `/api/v1/appointments/:id` | Update appointment    | Doctor/Patient       |
| DELETE | `/api/v1/appointments/:id` | Cancel appointment    | Doctor/Patient/Admin |

> 📚 For detailed API documentation with request/response examples, see [API_REFERENCE.md](API_REFERENCE.md) or import the Postman collection from the `postman/` directory.

## 🧪 Testing

### Postman Collections

Comprehensive Postman collections are available in the `postman/` directory:

- **Hospital-Management-API.postman_collection.json** - Full API endpoints
- **Hospital-API-TestSuite.postman_collection.json** - Automated test suite

### Running Tests

```bash
cd postman
npm install
npm test
```

### Test Environments

Three pre-configured environments are available:

- Development
- Staging
- Production

Import them into Postman from the `postman/` directory.

## 📚 Documentation

**Core Documentation:**

- [API Reference](API_REFERENCE.md) - Complete endpoint documentation with examples
- [Database Schema](DATABASE_SCHEMA.md) - Detailed database design and relationships
- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Heroku, AWS, Vercel, DigitalOcean

**Additional Resources:**

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project
- [Security Policy](SECURITY.md) - Security guidelines and vulnerability reporting
- [Postman Documentation](postman/README.md) - API testing and automation
- [Changelog](CHANGELOG.md) - Version history and release notes
- [LinkedIn Showcase](LINKEDIN_SHOWCASE.md) - Tips for showcasing this project

## 🚀 Deployment

For detailed deployment instructions to various platforms (Heroku, AWS, Vercel, DigitalOcean, Railway), see [DEPLOYMENT.md](DEPLOYMENT.md).

**Quick Deploy:**

- Ensure environment variables are properly configured
- Set `NODE_ENV=production`
- Use a production-grade database (MongoDB Atlas recommended)
- Enable HTTPS/SSL
- Configure CORS for your domain

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Quick steps:**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat(scope): add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses:

- **ESLint** with Airbnb configuration
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Node.js** best practices

Run quality checks before committing:

```bash
npm run lint:fix    # Fix ESLint issues
npm run format      # Format with Prettier
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amr Khaled Morcy**

- GitHub: [@3mr-5aled](https://github.com/3mr-5aled)
- Email: 3mr5aled.contact@gmail.com

## 🙏 Acknowledgments

- **Course Inspiration**: This project was developed as part of the [Node.js - Build a Full E-Commerce RESTful APIs](https://www.udemy.com/course/nodejs-build-a-full-e-commerce-restful-apis/) course by **Ahmed Boghdady**, **Mahmoud Bakr**, and **Index Academy** on Udemy. The course provided excellent guidance on building production-ready RESTful APIs with Node.js, Express, and MongoDB.
- **Express.js team** for the excellent framework
- **MongoDB team** for the robust database
- **Open Source Community** for all the amazing packages and tools
- All contributors and maintainers of the libraries used in this project

## 📞 Support

For support and questions:

- Open an issue on [GitHub](https://github.com/3mr-5aled/Hospital-API/issues)
- Email: 3mr5aled.contact@gmail.com
- Check existing documentation and closed issues

---

⭐ **If you found this project helpful, please give it a star!**

💼 **Portfolio Project**: This API demonstrates full-stack backend development skills including RESTful API design, authentication, database management, and security best practices.
