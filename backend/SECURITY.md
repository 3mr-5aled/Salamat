# Security Guide

## 🔒 Immediate Actions Required

### 1. Remove Exposed Credentials from Git History

Your `config.env` file with real credentials may already be in your Git history. To remove it:

```bash
# Remove config.env from Git history (BE CAREFUL - this rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config.env" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner (faster and safer):
# 1. Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
# 2. Run: java -jar bfg.jar --delete-files config.env
# 3. Run: git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### 2. Change ALL Passwords Immediately

⚠️ **CRITICAL**: The following credentials were exposed in `config.env`:

- [ ] **MongoDB Password**: Change `mongoindex55` on MongoDB Atlas
  - Go to: Database Access → Edit User → Change Password
- [ ] **Email Password**: Change or rotate `Morocontact55*`
  - For Gmail: Generate a new App Password
  - Settings → Security → 2-Step Verification → App passwords
- [ ] **JWT Secret**: Generate a new random secret
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 3. Update Your Application

After changing credentials:

1. Copy `.env.example` to `config.env`
2. Fill in your NEW credentials
3. Test your application
4. **NEVER commit `config.env` again**

### 4. Verify Security

```bash
# Check if config.env is ignored
git status

# config.env should NOT appear in untracked files

# Force remove if still tracked
git rm --cached config.env
git commit -m "Remove config.env from tracking"
```

## 🛡️ Best Practices Going Forward

### Environment Variables

- ✅ Use `.env.example` as a template
- ✅ Keep `config.env` in `.gitignore`
- ✅ Use different credentials for dev/staging/production
- ✅ Rotate secrets regularly (every 90 days)

### Passwords

- ✅ Use strong, unique passwords (32+ characters)
- ✅ Use password managers
- ✅ Enable 2FA on all services
- ✅ Never hardcode credentials in code

### MongoDB Security

- ✅ Use IP whitelist on MongoDB Atlas
- ✅ Create separate users for dev/prod
- ✅ Use least privilege principle
- ✅ Enable audit logs

### JWT Security

- ✅ Use long, random JWT secrets
- ✅ Set appropriate expiration times
- ✅ Use HTTPS in production
- ✅ Store tokens securely (httpOnly cookies)

## 📝 Security Checklist Before Publishing

- [ ] Remove all hardcoded credentials
- [ ] Verify `.gitignore` is working
- [ ] Check Git history for sensitive data
- [ ] Change all exposed passwords
- [ ] Use environment variables
- [ ] Enable rate limiting (✅ Already implemented)
- [ ] Use HTTPS in production
- [ ] Set up proper CORS (✅ Already implemented)
- [ ] Keep dependencies updated
- [ ] Enable security headers (✅ Already implemented with Helmet)

## 🚨 If Credentials Are Already on GitHub

If you've already pushed to GitHub:

1. **Delete the repository** on GitHub
2. Clean your local Git history (see above)
3. Change ALL passwords
4. Create a new repository
5. Push cleaned code

## 📞 Security Contact

If you discover a security vulnerability, please email: your-security-email@example.com

---

**Last Updated**: January 31, 2026
