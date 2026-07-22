# Contributing to Hospital Management API

First off, thank you for considering contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to foster an open and welcoming environment. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear descriptive title**
- **Detailed steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots** if applicable
- **Error messages and logs**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear descriptive title**
- **Detailed explanation of the feature**
- **Use cases and benefits**
- **Possible implementation approach**
- **Alternative solutions considered**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for beginners
- `help wanted` - Issues that need assistance

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git
- Text editor (VS Code recommended)

### Setup Steps

1. **Fork the repository**

   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/hospital-api.git
   cd hospital-api
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/hospital-api.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Setup environment**

   ```bash
   cp .env.example config.env
   # Edit config.env with your local settings
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.js
```

## 💻 Coding Standards

### JavaScript Style Guide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications defined in `.eslintrc.json`.

### General Guidelines

1. **Write clean, readable code**
   - Use meaningful variable and function names
   - Keep functions small and focused
   - Add comments for complex logic

2. **Follow existing patterns**
   - Match the coding style of the existing codebase
   - Use the established project structure

3. **Error handling**
   - Always handle errors appropriately
   - Use the ApiError utility for consistent error responses
   - Don't swallow errors silently

4. **Documentation**
   - Document all public APIs
   - Add JSDoc comments for functions
   - Update README.md if needed

### Code Formatting

```bash
# Check code style
npm run lint

# Auto-fix style issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### File Naming Conventions

- **Models**: `model-name.model.js` (e.g., `user.model.js`)
- **Controllers**: `entity.controller.js` (e.g., `auth.controller.js`)
- **Routes**: `entity.routes.js` (e.g., `patient.routes.js`)
- **Middleware**: `name.middleware.js` (e.g., `auth.middleware.js`)
- **Utils**: `description.utils.js` (e.g., `createToken.utils.js`)
- **Validators**: `entity.validators.js` (e.g., `doctor.validators.js`)

## 📝 Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system or dependencies
- `ci`: CI/CD configuration

### Examples

```bash
feat(auth): add password reset functionality

fix(appointments): prevent double booking for same time slot

docs(readme): update installation instructions

refactor(patient): extract validation logic to separate file

test(doctor): add unit tests for doctor controller
```

### Best Practices

- Use the imperative mood ("add" not "added")
- Don't capitalize the first letter
- No period at the end of the subject
- Keep subject line under 50 characters
- Separate subject from body with a blank line
- Reference issues and PRs in the footer

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow the coding standards
   - Add/update tests if applicable

4. **Run quality checks**

   ```bash
   npm run lint:fix
   npm run format
   npm test
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating the Pull Request

1. **Open a Pull Request** on GitHub
2. **Fill out the PR template** completely
3. **Link related issues** using keywords (Fixes #123, Closes #456)
4. **Request review** from maintainers
5. **Wait for CI checks** to pass

### PR Title Format

```
<type>(<scope>): <description>
```

Example:

```
feat(appointments): add appointment reminder notifications
```

### What to Include in PR Description

- **What**: Describe the changes
- **Why**: Explain the motivation
- **How**: Describe implementation approach
- **Testing**: How was it tested?
- **Screenshots**: If UI changes
- **Breaking Changes**: List any breaking changes
- **Related Issues**: Link to issues

### Review Process

1. At least one maintainer review required
2. All CI checks must pass
3. Code coverage should not decrease
4. All discussions must be resolved
5. Maintainer will merge when ready

### After Submission

- Be responsive to feedback
- Make requested changes promptly
- Keep the PR updated with main branch
- Engage constructively in discussions

## 🏗️ Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middlewares/    # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── validators/     # Input validation
```

## 🧪 Testing Guidelines

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [REST API Best Practices](https://restfulapi.net/)

## ❓ Questions?

- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
