# Salamat — Full-Stack Production Deployment Guide

This guide provides instructions for deploying both the **Frontend (Vite + React)** and **Backend (Node.js + Express + MongoDB)** of the Salamat Medical Appointment System.

---

## 🏗️ Architecture Overview

```
                          [ Client Browsers ]
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Nginx Reverse Proxy  │ (Port 80 / 443 with SSL)
                       └───────────┬───────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
    ┌──────────────────────┐               ┌──────────────────────┐
    │  Frontend (Vite Build│               │  Backend API (Node)  │
    │  Static Assets /dist)│               │  PM2 / Docker (8000) │
    └──────────────────────┘               └───────────┬──────────┘
                                                       │
                                                       ▼
                                           ┌──────────────────────┐
                                           │    MongoDB Atlas     │
                                           │  Production Cluster  │
                                           └──────────────────────┘
```

---

## ⚙️ Prerequisites

1. **Server Hardware**: 1 vCPU, 2GB RAM minimum (Ubuntu 22.04 LTS recommended).
2. **Domain Name**: Domain with A Records pointing to host server IP (`api.salamat.com` & `app.salamat.com`).
3. **Database**: MongoDB Atlas Cluster connection URI.
4. **Node.js**: Node v18+ & `npm`.
5. **Docker & Docker Compose** (Optional for containerized deployments).

---

## 🐳 Option 1: Docker Compose Deployment (Recommended)

### Step 1: Clone Repository
```bash
git clone https://github.com/3mr-5aled/Salamat-Medical-System.git
cd Salamat
```

### Step 2: Configure Production Environment Variables
Create `.env` in project root:

```env
# System Configuration
NODE_ENV=production
PORT=8000
VITE_PORT=8000

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/salamat?retryWrites=true&w=majority

# JWT Authentication Secrets
JWT_SECRET_KEY=super_secret_production_key_change_me_32chars
JWT_EXPIRE_TIME=90d

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admin@salamat.com
EMAIL_PASSWORD=your_app_password

# Allowed Origins
ALLOWED_ORIGINS=https://app.salamat.com,https://admin.salamat.com
```

### Step 3: Run Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 💻 Option 2: PM2 & Nginx Deployment on VPS / AWS EC2

### Step 1: Install Node.js, PM2, and Nginx
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### Step 2: Build Frontend Assets
```bash
cd Salamat/frontend
npm ci
npm run build
# Dist folder generated at Salamat/frontend/dist
```

### Step 3: Start Backend via PM2
```bash
cd Salamat/backend
npm ci --production
pm2 start server.js --name "salamat-backend"
pm2 save
pm2 startup
```

### Step 4: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/salamat`:

```nginx
server {
    listen 80;
    server_name app.salamat.com;

    # Serve React Frontend Static Build
    location / {
        root /var/www/Salamat/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Express Backend
    location /api/v1 {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & enable SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/salamat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d app.salamat.com
```

---

## 🔒 Production Security Checklist

- [x] Set `NODE_ENV=production`.
- [x] Rotate `JWT_SECRET_KEY` with strong random string.
- [x] Restrict MongoDB Atlas IP Whitelist.
- [x] Enforce SSL/TLS HTTPS redirection.
- [x] Confirm backend rate limiting (`express-rate-limit`) is enabled.
- [x] Confirm HTTP Security Headers (`helmet`) are active.
