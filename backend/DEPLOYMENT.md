# Deployment Guide

## Overview

This guide provides instructions for deploying the Hospital Management API to various platforms.

## Prerequisites

- Node.js application ready for production
- MongoDB database (MongoDB Atlas recommended)
- Environment variables configured
- Git repository

---

## Option 1: Heroku Deployment

### Step 1: Install Heroku CLI

```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

### Step 2: Login and Create App

```bash
heroku login
heroku create your-hospital-api
```

### Step 3: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=8000
heroku config:set db_uri="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET_KEY="your-jwt-secret"
heroku config:set JWT_EXPIRE_TIME=90d
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER="your-email"
heroku config:set EMAIL_PASSWORD="your-password"
```

### Step 4: Deploy

```bash
git push heroku main
```

### Step 5: Open Your App

```bash
heroku open
heroku logs --tail  # View logs
```

---

## Option 2: Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy

```bash
vercel --prod
```

### Step 4: Set Environment Variables

Go to Vercel Dashboard → Project Settings → Environment Variables

---

## Option 3: DigitalOcean App Platform

### Step 1: Connect Repository

1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your GitHub repository

### Step 2: Configure App

- **Environment**: Node.js
- **Build Command**: `npm install`
- **Run Command**: `npm start`

### Step 3: Add Environment Variables

In App Platform dashboard, add all required environment variables.

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

---

## Option 4: AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. Choose Ubuntu Server 22.04 LTS
2. Instance type: t2.micro (free tier) or t2.small
3. Configure security groups:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
   - Custom TCP (port 8000)

### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### Step 4: Clone and Setup

```bash
# Clone repository
git clone https://github.com/yourusername/hospital-api.git
cd hospital-api

# Install dependencies
npm install

# Create config.env
nano config.env
# Add your environment variables

# Start with PM2
pm2 start server.js --name hospital-api
pm2 startup
pm2 save
```

### Step 5: Setup Nginx (Optional)

```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/hospital-api
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hospital-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Option 5: Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
config.env
logs
uploads
```

### Step 3: Build and Run

```bash
# Build image
docker build -t hospital-api .

# Run container
docker run -d \
  -p 8000:8000 \
  --name hospital-api \
  --env-file config.env \
  hospital-api

# View logs
docker logs -f hospital-api
```

### Step 4: Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - config.env
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

Run with:

```bash
docker-compose up -d
```

---

## Production Checklist

### Before Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (32+ characters)
- [ ] Configure production MongoDB connection
- [ ] Set up proper CORS origins
- [ ] Configure email service for production
- [ ] Remove all console.log statements
- [ ] Test all endpoints
- [ ] Run security audit (`npm audit`)
- [ ] Update dependencies
- [ ] Set up error monitoring (optional)

### After Deployment

- [ ] Test all API endpoints on production
- [ ] Verify database connection
- [ ] Test email functionality
- [ ] Check logs for errors
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Configure SSL/HTTPS
- [ ] Set up backups
- [ ] Document the live API URL

---

## Environment Variables

Required for all deployments:

```env
NODE_ENV=production
PORT=8000
BASE_URL=https://your-domain.com

# Database
db_uri=mongodb+srv://user:pass@cluster.mongodb.net/db

# JWT
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_EXPIRE_TIME=90d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional
ALLOWED_ORIGINS=https://your-frontend.com,https://app.your-domain.com
```

---

## Monitoring & Maintenance

### Health Check Endpoint

Add to your Express app:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### Monitoring Services

- **UptimeRobot**: Free uptime monitoring
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **Datadog**: Infrastructure monitoring

### Backup Strategy

1. **Automated MongoDB Backups**: Use MongoDB Atlas automated backups
2. **Code Backups**: Keep Git repository updated
3. **Environment Variables**: Store securely in password manager
4. **Regular Testing**: Test restore procedures

---

## Troubleshooting

### Application Won't Start

1. Check environment variables are set
2. Verify database connection string
3. Check Node.js version compatibility
4. Review logs for errors

### Database Connection Issues

1. Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)
2. Check connection string format
3. Verify database user credentials
4. Test connection string locally

### Email Not Sending

1. Verify email credentials
2. Check if using App Password (Gmail)
3. Verify SMTP settings
4. Test in development mode first

---

## Support

For deployment issues:

- Check platform-specific documentation
- Review application logs
- Test locally first
- Verify all environment variables

---

**Last Updated**: January 31, 2026
