# Complete Deployment Guide - India Skills / WorldSkills Protocol System

> Step-by-step guide to deploy all 4 modules on AWS EC2 with MongoDB installed locally on the VM.
> Written for absolute beginners - no prior deployment knowledge required.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Prerequisites - What You Need Before Starting](#2-prerequisites)
3. [Part 1: AWS EC2 Instance Setup](#3-part-1-aws-ec2-instance-setup)
4. [Part 2: Connect to Your EC2 Instance](#4-part-2-connect-to-ec2)
5. [Part 3: Install System Dependencies](#5-part-3-install-system-dependencies)
6. [Part 4: Install & Configure MongoDB on the VM](#6-part-4-install-mongodb-on-vm)
7. [Part 5: Deploy Module A (WorldSkills Speed Tasks)](#7-part-5-deploy-module-a)
8. [Part 6: Deploy Module B (Slideshow Frontend App)](#8-part-6-deploy-module-b)
9. [Part 7: Deploy Module C (Music Catalog API)](#9-part-7-deploy-module-c)
10. [Part 8: Deploy Module D (Taiwan Tourism Full-Stack)](#10-part-8-deploy-module-d)
11. [Part 9: Nginx Reverse Proxy Configuration](#11-part-9-nginx-reverse-proxy)
12. [Part 10: PM2 Process Manager (Keep Apps Running)](#12-part-10-pm2-process-manager)
13. [Part 11: Domain & SSL Setup (Optional)](#13-part-11-domain-ssl)
14. [Part 12: Firewall & Security](#14-part-12-firewall-security)
15. [Part 13: MongoDB Backup & Maintenance](#15-part-13-mongodb-backup)
16. [Part 14: Monitoring & Maintenance](#16-part-14-monitoring)
17. [Troubleshooting](#17-troubleshooting)
18. [Quick Reference Cheat Sheet](#18-quick-reference)

---

## 1. System Overview

### What Are We Deploying?

| Module | Type | Tech Stack | Port | Database |
|--------|------|------------|------|----------|
| **Module A** | 40 mini-projects (frontend + some backends) | HTML/CSS/JS, Express, Socket.io, MongoDB | 8080, 3000, 3001, 3002 | MongoDB (local) |
| **Module B** | Frontend-only slideshow app | HTML/CSS/JS (no server) | Static files | None (uses localStorage) |
| **Module C** | Backend REST API (Music Catalog) | Express.js, Mongoose | 3003 | MongoDB (local) |
| **Module D** | Full-stack tourism platform | Express.js, Mongoose, HTML/CSS/JS | 3004 | MongoDB (local) |

### Architecture Diagram

```
                    INTERNET
                       |
                  [Your Domain / EC2 IP]
                       |
              ┌──────────────────────────────┐
              │      AWS EC2 Instance         │
              │                               │
              │    [Nginx] (Port 80/443)      │
              │    /    |    \      \          │
              │   /     |     \      \         │
              │ Mod A  Mod B  Mod C  Mod D    │
              │ (multi)(static)(3003)(3004)    │
              │                               │
              │    [MongoDB] (Port 27017)      │
              │    (Installed on same VM)      │
              │    ┌─────────────────────┐     │
              │    │ DB: module-a-excel  │     │
              │    │ DB: module-a-cal    │     │
              │    │ DB: module-c        │     │
              │    │ DB: module-d        │     │
              │    └─────────────────────┘     │
              └──────────────────────────────┘
```

**Key difference from cloud setups**: MongoDB runs on the SAME machine as your apps.
Connection string will be `mongodb://localhost:27017/database-name` (no Atlas needed).

---

## 2. Prerequisites

### What You Need

1. **AWS Account** - Create at https://aws.amazon.com (free tier available)
2. **A computer with internet** (Windows/Mac/Linux)
3. **PuTTY** (Windows) or **Terminal** (Mac/Linux) - to connect to your server
4. **(Optional) A domain name** - from GoDaddy, Namecheap, etc.

### Estimated Costs

| Service | Free Tier | Paid (After Free Tier) |
|---------|-----------|----------------------|
| EC2 t2.medium (recommended) | Not free tier | ~$34/month |
| EC2 t2.micro (1 yr free) | Free | ~$8.50/month after |
| Domain Name | Not free | ~$10-15/year |
| MongoDB | **FREE** (self-hosted on VM) | $0 |

> **Note**: Since we're running MongoDB on the VM too, a t2.micro (1GB RAM) will struggle.
> **t2.medium (4GB RAM) is strongly recommended** for running MongoDB + 6 Node.js apps.

---

## 3. Part 1: AWS EC2 Instance Setup

### Step 1: Log into AWS Console

1. Go to https://console.aws.amazon.com
2. Sign in with your AWS account
3. In the top-right corner, select region: **Asia Pacific (Mumbai) ap-south-1**

### Step 2: Launch an EC2 Instance

1. Search for **"EC2"** in the search bar at the top
2. Click **"EC2"** to go to the EC2 Dashboard
3. Click the orange **"Launch instance"** button

### Step 3: Configure the Instance

#### Name and Tags
- **Name**: `skills-server`

#### Application and OS Images (AMI)
- Click **"Ubuntu"**
- Select: **Ubuntu Server 22.04 LTS (Free tier eligible)**
  - **Why 22.04 and not 24.04?** MongoDB Community Edition has better official support for 22.04
- Architecture: **64-bit (x86)**

#### Instance Type
- Select: **t2.medium** (2 vCPU, 4GB RAM) - **RECOMMENDED**
  - MongoDB alone needs ~500MB-1GB RAM
  - 6 Node.js apps need ~300MB total
  - Nginx + OS need ~500MB
  - t2.micro (1GB) will run out of memory and crash

#### Key Pair (Login)
1. Click **"Create new key pair"**
2. Key pair name: `skills-key`
3. Key pair type: **RSA**
4. Private key file format:
   - If using **PuTTY** (Windows): Choose `.ppk`
   - If using **Terminal** (Mac/Linux): Choose `.pem`
5. Click **"Create key pair"**
6. **The key file will download automatically - SAVE THIS FILE. You cannot download it again!**

#### Network Settings
1. Click **"Edit"**
2. Check these boxes:
   - [x] Allow SSH traffic from: **My IP** (or Anywhere if your IP changes often)
   - [x] Allow HTTPS traffic from the internet
   - [x] Allow HTTP traffic from the internet
3. Click **"Add security group rule"** to add custom ports:

   | Type | Port Range | Source | Description |
   |------|-----------|--------|-------------|
   | Custom TCP | 3000-3010 | 0.0.0.0/0 | Node.js apps |
   | Custom TCP | 8080 | 0.0.0.0/0 | Chat app |

   > **IMPORTANT**: Do NOT open port 27017 (MongoDB) to the internet. MongoDB should only be accessible from localhost.

#### Configure Storage
- Change from 8 GB to **25 GB** (gp3)
- MongoDB data + all modules + dependencies need space
- 25GB gives comfortable room

### Step 4: Launch the Instance

1. Review everything
2. Click **"Launch instance"**
3. Click **"View all instances"**
4. Wait for **Instance State** to show **"Running"** (takes 1-2 minutes)
5. Click on your instance to see details
6. **Copy the "Public IPv4 address"** - this is your server's IP address
   - Example: `13.235.48.123`

### Step 5: Save Your EC2 Details

Write these down somewhere safe:
```
EC2 Public IP: _____________________ (e.g., 13.235.48.123)
Key file location: _________________ (e.g., C:\Users\YourName\Downloads\skills-key.ppk)
Username: ubuntu
```

---

## 4. Part 2: Connect to Your EC2 Instance

### Option A: Using PuTTY (Windows)

1. Download PuTTY from https://www.putty.org if you don't have it
2. Open PuTTY
3. In **Host Name**: Enter your EC2 Public IP (e.g., `13.235.48.123`)
4. Port: `22`
5. In the left panel, go to: **Connection > SSH > Auth > Credentials**
6. Click **"Browse"** next to "Private key file for authentication"
7. Select your `skills-key.ppk` file
8. Go back to **Session** in the left panel
9. In "Saved Sessions", type `skills-server` and click **Save**
10. Click **"Open"**
11. If prompted "The host key is not cached", click **"Accept"**
12. Login as: `ubuntu`
13. You should see: `ubuntu@ip-172-31-xx-xx:~$`

### Option B: Using Terminal (Mac/Linux)

```bash
chmod 400 ~/Downloads/skills-key.pem
ssh -i ~/Downloads/skills-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Option C: Using Windows Terminal / Git Bash

```bash
ssh -i /c/Users/YourName/Downloads/skills-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**You are now inside your EC2 server. All commands from here run on the server.**

---

## 5. Part 3: Install System Dependencies

### Step 1: Update the System

```bash
sudo apt update
sudo apt upgrade -y
```

This takes 2-5 minutes. Wait for it to finish.

### Step 2: Install Node.js (Version 20 LTS)

```bash
# Install Node.js 20 using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
# Should show: v20.x.x

npm --version
# Should show: 10.x.x
```

### Step 3: Install Nginx (Web Server / Reverse Proxy)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
# Should show "active (running)"
```

**Quick test**: Open `http://YOUR_EC2_IP` in your browser. You should see "Welcome to nginx!"

### Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### Step 5: Install Git

```bash
sudo apt install -y git
git --version
```

### Step 6: Create Project Directory Structure

```bash
sudo mkdir -p /var/www/skills
sudo chown -R ubuntu:ubuntu /var/www/skills

mkdir -p /var/www/skills/module-a
mkdir -p /var/www/skills/module-b
mkdir -p /var/www/skills/module-c
mkdir -p /var/www/skills/module-d
```

---

## 6. Part 4: Install & Configure MongoDB on the VM

> This is the most critical section. We install MongoDB Community Edition directly on the EC2 instance.
> All your apps will connect to `mongodb://localhost:27017/database-name`.

### Step 1: Import the MongoDB GPG Key

```bash
# Install gnupg if not present
sudo apt install -y gnupg curl

# Import MongoDB's public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

### Step 2: Add the MongoDB Repository

```bash
# Add the MongoDB 7.0 repository for Ubuntu 22.04 (Jammy)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### Step 3: Install MongoDB

```bash
# Update package list to include the new repo
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org
```

### Step 4: Start MongoDB & Enable Auto-Start on Boot

```bash
# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start automatically when the VM reboots
sudo systemctl enable mongod

# Check MongoDB status
sudo systemctl status mongod
```

You should see output containing:
```
● mongod.service - MongoDB Database Server
     Active: active (running)
```

### Step 5: Verify MongoDB is Working

```bash
# Connect to MongoDB shell
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/...
MongoDB server version: 7.0.x
test>
```

Type these commands inside the MongoDB shell:

```javascript
// Show existing databases
show dbs

// Should show:
// admin   40.00 KiB
// config  72.00 KiB
// local   40.00 KiB

// Exit the shell
exit
```

**MongoDB is now running on your VM at `localhost:27017`!**

### Step 6: Create Databases and Admin User (Security)

```bash
# Connect to MongoDB shell
mongosh
```

Inside the mongosh shell, run:

```javascript
// ============================================
// Create an admin user for MongoDB security
// ============================================
use admin

db.createUser({
  user: "skillsadmin",
  pwd: "ChangeThisToAStrongPassword123!",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
})

// Should output: { ok: 1 }

// ============================================
// Create the databases for each module
// ============================================

// Module A - Excel Download
use module_a_excel
db.createCollection("posts")
// Output: { ok: 1 }

// Module A - Recurring Calendar
use module_a_calendar
db.createCollection("tasks")
// Output: { ok: 1 }

// Module C - Music Catalog
use module_c
db.createCollection("users")
// Output: { ok: 1 }

// Module D - Taiwan Tourism
use module_d
db.createCollection("regions")
// Output: { ok: 1 }

// Verify all databases were created
show dbs

// Should show:
// admin             100.00 KiB
// config             72.00 KiB
// local              40.00 KiB
// module_a_calendar   8.00 KiB
// module_a_excel      8.00 KiB
// module_c            8.00 KiB
// module_d            8.00 KiB

exit
```

### Step 7: Enable MongoDB Authentication (Security)

```bash
# Edit MongoDB config file
sudo nano /etc/mongod.conf
```

Find the `#security:` section (around line 28-30) and change it to:

```yaml
security:
  authorization: enabled
```

**Make sure**:
- Remove the `#` before `security:`
- `authorization: enabled` is indented with **2 spaces** (not tabs)

Also verify the `bindIp` setting in the same file:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

> `bindIp: 127.0.0.1` means MongoDB ONLY accepts connections from the same machine.
> This is critical for security - never change this to `0.0.0.0` unless you know what you're doing.

Save and exit (`Ctrl+X`, `Y`, `Enter`)

### Step 8: Restart MongoDB with Authentication

```bash
sudo systemctl restart mongod

# Verify it's still running
sudo systemctl status mongod
```

### Step 9: Test Authentication

```bash
# Try connecting WITHOUT credentials (should fail for most operations)
mongosh
```

```javascript
use module_c
show collections
// Should show error: MongoServerError: command listCollections requires authentication

exit
```

```bash
# Now connect WITH credentials (should work)
mongosh -u "skillsadmin" -p "ChangeThisToAStrongPassword123!" --authenticationDatabase admin
```

```javascript
use module_c
show collections
// Should show: users

exit
```

**MongoDB is now secured with authentication!**

### Step 10: Write Down Your Connection Strings

These are the connection strings your apps will use:

```
# Format:
# mongodb://USERNAME:PASSWORD@localhost:27017/DATABASE_NAME?authSource=admin

# Module A - Excel Download
mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_a_excel?authSource=admin

# Module A - Recurring Calendar
mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_a_calendar?authSource=admin

# Module C - Music Catalog
mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_c?authSource=admin

# Module D - Taiwan Tourism
mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_d?authSource=admin
```

> **If you want to keep it simple** (skip authentication for development/testing):
> You can skip Steps 7-9 and use simple connection strings like:
> `mongodb://localhost:27017/module_c`
> This is less secure but easier. For a competition VM, this is usually fine.

### MongoDB Quick Reference

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -50 /var/log/mongodb/mongod.log

# Connect to shell (with auth)
mongosh -u "skillsadmin" -p "YOUR_PASSWORD" --authenticationDatabase admin

# Connect to shell (without auth, if auth is disabled)
mongosh

# MongoDB data is stored at:
# /var/lib/mongodb/

# MongoDB config file:
# /etc/mongod.conf
```

---

## 7. Part 5: Deploy Module A (WorldSkills Speed Tasks)

> Module A contains 40 mini-projects. We deploy the backend projects that need servers,
> and the frontend-only projects are served as static files through Nginx.

### Step 1: Upload Module A Files to EC2

Open a **new terminal** on your LOCAL machine (not EC2):

**Windows (Git Bash):**
```bash
scp -i /c/Users/KIIT0001/Downloads/skills-key.pem -r \
  "/c/Users/KIIT0001/OneDrive/Documents/Practice/Module A/speed2024-main" \
  ubuntu@YOUR_EC2_IP:/var/www/skills/module-a/
```

**Using FileZilla (GUI - Easier for Beginners):**
1. Download FileZilla from https://filezilla-project.org
2. Open FileZilla
3. Go to **Edit > Settings > SFTP** > Click **"Add key file"** > Select your `.ppk` or `.pem` file
4. In the top bar:
   - Host: `sftp://YOUR_EC2_IP`
   - Username: `ubuntu`
   - Port: `22`
5. Click **"Quickconnect"**
6. Navigate to `/var/www/skills/module-a/` on the right panel (server)
7. Drag and drop the `speed2024-main` folder from left (local) to right (server)

**Using GitHub:**
```bash
cd /var/www/skills/module-a
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git speed2024-main
```

### Step 2: Verify Upload

```bash
ls /var/www/skills/module-a/speed2024-main/
# Should show all 40 project directories
```

### Step 3: Deploy Backend Projects

#### 3a. Real-time Chat (Express + Socket.io) - No MongoDB needed

```bash
cd /var/www/skills/module-a/speed2024-main/realtime_chat/answer/back-end
npm install

# Test it
node index.js
# Should show "Server is running on port 8080"
# Press Ctrl+C to stop
```

#### 3b. Excel Download (Express + MongoDB)

```bash
cd /var/www/skills/module-a/speed2024-main/excel-download/express-mongoose
npm install

# Edit server.js to use local MongoDB
nano server.js
```

Find this line:
```javascript
mongoose.connect('mongodb://localhost:27017/excel_download')
```

**Option A - If you enabled MongoDB authentication (Step 7-9 above):**
Replace with:
```javascript
mongoose.connect('mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_a_excel?authSource=admin')
```

**Option B - If you skipped authentication (simpler):**
Replace with:
```javascript
mongoose.connect('mongodb://localhost:27017/module_a_excel')
```

Save and exit (`Ctrl+X`, `Y`, `Enter`)

```bash
# Seed the database if available
npm run seed 2>/dev/null || echo "No seed script"

# Test it
node server.js
# Should show server running message
# Press Ctrl+C to stop
```

#### 3c. Recurring Calendar (Express + MongoDB)

```bash
cd /var/www/skills/module-a/speed2024-main/recurring-calendar/express-mongoose
npm install
nano server.js
```

Find and replace the MongoDB URI (same pattern as above):
```javascript
// OLD:
mongoose.connect('mongodb://localhost:27017/recurring_calendar')

// NEW (with auth):
mongoose.connect('mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_a_calendar?authSource=admin')

// NEW (without auth):
mongoose.connect('mongodb://localhost:27017/module_a_calendar')
```

Save and exit.

```bash
# Test
node server.js
# Press Ctrl+C to stop
```

#### 3d. API CORS (Express - No MongoDB)

```bash
cd /var/www/skills/module-a/speed2024-main/api-cors/express-mongoose
npm install

# Test
node server.js
# Press Ctrl+C to stop
```

### Step 4: Start All Module A Backends with PM2

```bash
# Real-time Chat
cd /var/www/skills/module-a/speed2024-main/realtime_chat/answer/back-end
pm2 start index.js --name "module-a-chat"

# Excel Download
cd /var/www/skills/module-a/speed2024-main/excel-download/express-mongoose
pm2 start server.js --name "module-a-excel"

# Recurring Calendar
cd /var/www/skills/module-a/speed2024-main/recurring-calendar/express-mongoose
pm2 start server.js --name "module-a-calendar"

# API CORS
cd /var/www/skills/module-a/speed2024-main/api-cors/express-mongoose
pm2 start server.js --name "module-a-cors"

# Save and verify
pm2 save
pm2 list
```

---

## 8. Part 6: Deploy Module B (Slideshow Frontend App)

> Pure frontend - no server needed. Just copy files and serve with Nginx.

### Step 1: Upload Module B Files

From your local machine:
```bash
scp -i /path/to/skills-key.pem -r "/path/to/Module B/XX_module_e" \
  ubuntu@YOUR_EC2_IP:/var/www/skills/module-b/
```

Or use FileZilla to drag-drop `XX_module_e` to `/var/www/skills/module-b/`

### Step 2: Verify & Set Permissions

```bash
ls /var/www/skills/module-b/XX_module_e/
# Should show: index.html, css/, js/, icons/, sample-photos/

sudo chown -R www-data:www-data /var/www/skills/module-b/
sudo chmod -R 755 /var/www/skills/module-b/
```

**Done!** Module B will be served by Nginx (configured later).

---

## 9. Part 7: Deploy Module C (Music Catalog API - Backend Only)

### Step 1: Upload Module C Files

From your local machine (exclude node_modules):
```bash
# Create a temp directory excluding node_modules, then upload
scp -i /path/to/skills-key.pem -r "/path/to/Module C/" \
  ubuntu@YOUR_EC2_IP:/var/www/skills/module-c/
```

On EC2, remove node_modules if accidentally uploaded:
```bash
rm -rf /var/www/skills/module-c/node_modules
```

### Step 2: Install Dependencies

```bash
cd /var/www/skills/module-c
npm install
```

### Step 3: Configure Environment Variables

```bash
nano /var/www/skills/module-c/.env
```

Add the following (use LOCAL MongoDB, not Atlas):

```env
# WITH authentication:
MONGO_URI=mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_c?authSource=admin

# WITHOUT authentication (simpler):
# MONGO_URI=mongodb://localhost:27017/module_c

PORT=3003
NODE_ENV=production
```

Save and exit.

### Step 4: Update the Server Port

```bash
nano /var/www/skills/module-c/server.js
```

Change the port:
```javascript
// OLD:
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// NEW:
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Save and exit.

### Step 5: Test Module C

```bash
cd /var/www/skills/module-c
node server.js
```

You should see:
```
MongoDB Connected
Server running on port 3003
```

Test the API:
```bash
# Open a second SSH session or use another terminal tab
curl http://localhost:3003/api/albums
# Should return: [] or some JSON
```

Press `Ctrl+C` to stop.

### Step 6: Start with PM2

```bash
cd /var/www/skills/module-c
pm2 start server.js --name "module-c"
pm2 save
```

---

## 10. Part 8: Deploy Module D (Taiwan Tourism - Full Stack)

### Step 1: Upload Module D Files

```bash
scp -i /path/to/skills-key.pem -r "/path/to/Module D/" \
  ubuntu@YOUR_EC2_IP:/var/www/skills/module-d/
```

Remove node_modules if uploaded:
```bash
rm -rf /var/www/skills/module-d/node_modules
```

### Step 2: Install Dependencies

```bash
cd /var/www/skills/module-d
npm install
```

### Step 3: Configure Environment Variables

```bash
nano /var/www/skills/module-d/.env
```

Add:
```env
# WITH authentication:
MONGO_URI=mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_d?authSource=admin

# WITHOUT authentication (simpler):
# MONGO_URI=mongodb://localhost:27017/module_d

PORT=3004
NODE_ENV=production
```

Save and exit.

### Step 4: Update the Server Port

```bash
nano /var/www/skills/module-d/server.js
```

Change:
```javascript
// OLD:
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// NEW:
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Save and exit.

### Step 5: Seed the Database

```bash
cd /var/www/skills/module-d
npm run seed
```

You should see messages about regions, attractions, and info items being created.

> **If seed fails with auth error**: Make sure your .env MONGO_URI matches what you configured.
> The seed script reads the .env file to connect to MongoDB.

### Step 6: Test Module D

```bash
node server.js
```

You should see:
```
MongoDB Connected
Server running on port 3004
```

**Test in browser**: Go to `http://YOUR_EC2_IP:3004`
You should see the Taiwan Tourism website!

Press `Ctrl+C` to stop.

### Step 7: Start with PM2

```bash
cd /var/www/skills/module-d
pm2 start server.js --name "module-d"
pm2 save
```

---

## 11. Part 9: Nginx Reverse Proxy Configuration

> Nginx sits in front of everything. Users hit port 80, Nginx routes to the right app.

### Step 1: Create the Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/skills
```

Paste this entire configuration:

```nginx
# ============================================
# Skills Protocol - Nginx Configuration
# ============================================

server {
    listen 80;
    server_name YOUR_EC2_IP;  # Replace with your domain or EC2 IP

    # Max upload size (for file uploads in modules)
    client_max_body_size 50M;

    # ---- Module B: Slideshow App (Frontend Only) ----
    # URL: http://YOUR_EC2_IP/slideshow
    location /slideshow {
        alias /var/www/skills/module-b/XX_module_e;
        index index.html;
        try_files $uri $uri/ /slideshow/index.html;
    }

    # ---- Module A: Static Frontend Projects ----
    # URL: http://YOUR_EC2_IP/speed-tasks/PROJECT_NAME
    location /speed-tasks {
        alias /var/www/skills/module-a/speed2024-main;
        index index.html;
        autoindex on;  # Show directory listing
        try_files $uri $uri/ =404;
    }

    # ---- Module A: Chat Backend (WebSocket) ----
    location /api/chat/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Module A: Excel Download Backend ----
    location /api/excel/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Module A: Calendar Backend ----
    location /api/calendar/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Module A: CORS API Backend ----
    location /api/cors/ {
        proxy_pass http://127.0.0.1:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Module C: Music Catalog API ----
    location /api/music/ {
        proxy_pass http://127.0.0.1:3003/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Module D: Taiwan Tourism (Full Stack) ----
    location /tourism/ {
        proxy_pass http://127.0.0.1:3004/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Default: Landing Page ----
    location / {
        root /var/www/skills/landing;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # ---- Error Pages ----
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

Save and exit.

### Step 2: Create a Landing Page

```bash
sudo mkdir -p /var/www/skills/landing
sudo nano /var/www/skills/landing/index.html
```

Paste:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skills Protocol - Project Hub</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a; color: #e2e8f0;
            min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; padding: 40px 20px;
        }
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .subtitle { color: #94a3b8; margin-bottom: 40px; font-size: 1.1rem; }
        .grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px; max-width: 1200px; width: 100%;
        }
        .card {
            background: #1e293b; border: 1px solid #334155;
            border-radius: 12px; padding: 24px;
            transition: transform 0.2s, border-color 0.2s;
        }
        .card:hover { transform: translateY(-4px); border-color: #3b82f6; }
        .card h2 { color: #f1f5f9; margin-bottom: 8px; }
        .card p { color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
        .card a {
            display: inline-block; padding: 8px 20px;
            background: #3b82f6; color: white; text-decoration: none;
            border-radius: 6px; font-weight: 500;
        }
        .card a:hover { background: #2563eb; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-bottom: 12px; }
        .tag-frontend { background: #065f46; color: #6ee7b7; }
        .tag-backend { background: #7c2d12; color: #fdba74; }
        .tag-fullstack { background: #4c1d95; color: #c4b5fd; }
        .status { margin-top: 40px; padding: 16px 24px; background: #1e293b; border-radius: 8px; border: 1px solid #334155; }
        .status h3 { color: #3b82f6; margin-bottom: 8px; }
        .status code { background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #fbbf24; }
    </style>
</head>
<body>
    <h1>Skills Protocol Hub</h1>
    <p class="subtitle">India Skills / WorldSkills Competition Modules</p>
    <div class="grid">
        <div class="card">
            <span class="tag tag-fullstack">Full Stack + Frontend</span>
            <h2>Module A - Speed Tasks</h2>
            <p>40 WorldSkills Lyon 2024 speed test projects covering animations, APIs, real-time apps, and more.</p>
            <a href="/speed-tasks/">Browse Projects</a>
        </div>
        <div class="card">
            <span class="tag tag-frontend">Frontend Only</span>
            <h2>Module B - Slideshow App</h2>
            <p>Interactive photo slideshow with drag-drop uploads, 4 transition themes, dark mode, and keyboard shortcuts.</p>
            <a href="/slideshow/">Open App</a>
        </div>
        <div class="card">
            <span class="tag tag-backend">Backend API</span>
            <h2>Module C - Music Catalog</h2>
            <p>REST API for managing albums, songs, and users with authentication, pagination, and statistics.</p>
            <a href="/api/music/api/albums">View API</a>
        </div>
        <div class="card">
            <span class="tag tag-fullstack">Full Stack</span>
            <h2>Module D - Taiwan Tourism</h2>
            <p>Tourism platform with interactive map, regional guides, attractions, and contact form.</p>
            <a href="/tourism/">Visit Site</a>
        </div>
    </div>
    <div class="status">
        <h3>Server Info</h3>
        <p>MongoDB: <code>localhost:27017</code> | Nginx: <code>port 80</code> | Node.js apps managed by <code>PM2</code></p>
    </div>
</body>
</html>
```

Save and exit.

### Step 3: Enable the Configuration

```bash
# Remove default Nginx config
sudo rm /etc/nginx/sites-enabled/default

# Enable our config
sudo ln -s /etc/nginx/sites-available/skills /etc/nginx/sites-enabled/skills

# Test for syntax errors
sudo nginx -t
# Should show: syntax is ok / test is successful

# Restart Nginx
sudo systemctl restart nginx
```

### Step 4: Test Everything

| URL | Expected Result |
|-----|----------------|
| `http://YOUR_EC2_IP/` | Landing page with 4 module cards |
| `http://YOUR_EC2_IP/slideshow/` | Module B slideshow app |
| `http://YOUR_EC2_IP/speed-tasks/` | Module A directory listing |
| `http://YOUR_EC2_IP/api/music/api/albums` | Module C JSON response |
| `http://YOUR_EC2_IP/tourism/` | Module D Taiwan tourism site |

---

## 12. Part 10: PM2 Process Manager (Keep Apps Running)

### View Final Process List

```bash
pm2 list

# Expected output:
# ┌─────┬──────────────────┬─────────┬──────┬────────┐
# │ id  │ name             │ status  │ cpu  │ mem    │
# ├─────┼──────────────────┼─────────┼──────┼────────┤
# │ 0   │ module-a-chat    │ online  │ 0%   │ 35MB   │
# │ 1   │ module-a-excel   │ online  │ 0%   │ 40MB   │
# │ 2   │ module-a-calendar│ online  │ 0%   │ 38MB   │
# │ 3   │ module-a-cors    │ online  │ 0%   │ 32MB   │
# │ 4   │ module-c         │ online  │ 0%   │ 45MB   │
# │ 5   │ module-d         │ online  │ 0%   │ 50MB   │
# └─────┴──────────────────┴─────────┴──────┴────────┘
```

### Configure Auto-Start on Boot

```bash
# Generate startup script
pm2 startup

# PM2 will output a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
# COPY AND RUN THAT EXACT COMMAND

# Save the current process list
pm2 save
```

Now if the VM reboots, both MongoDB AND all Node.js apps restart automatically.

### Essential PM2 Commands

```bash
pm2 list                     # View all processes
pm2 logs                     # View all logs (live)
pm2 logs module-c            # View logs for specific app
pm2 restart all              # Restart all apps
pm2 restart module-c         # Restart specific app
pm2 stop module-d            # Stop specific app
pm2 delete module-d          # Remove from PM2
pm2 monit                    # Real-time CPU/Memory monitor
```

---

## 13. Part 11: Domain & SSL Setup (Optional)

### Step 1: Get a Domain Name

1. Go to https://www.namecheap.com or https://www.godaddy.com
2. Purchase a domain (~$10-15/year)

### Step 2: Point Domain to EC2

1. In your domain registrar's DNS settings, add **A Records**:
   - `@` → Your EC2 Public IP
   - `www` → Your EC2 Public IP
2. Wait 5-30 minutes for DNS propagation

### Step 3: Update Nginx & Get SSL

```bash
# Update server_name in Nginx config
sudo nano /etc/nginx/sites-available/skills
# Change: server_name YOUR_EC2_IP;
# To:     server_name myskillsproject.com www.myskillsproject.com;

sudo nginx -t
sudo systemctl restart nginx

# Install Certbot for free SSL
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d myskillsproject.com -d www.myskillsproject.com

# Follow prompts: enter email, agree to terms
# Certbot auto-configures Nginx for HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 14. Part 12: Firewall & Security

### Configure UFW Firewall

```bash
# Allow SSH (don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow Node.js ports (for direct testing only)
sudo ufw allow 3000:3010/tcp
sudo ufw allow 8080/tcp

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status
```

### MongoDB Security Checklist

- [x] MongoDB binds to `127.0.0.1` only (cannot be reached from internet)
- [x] MongoDB authentication is enabled
- [x] Port 27017 is NOT open in EC2 Security Groups
- [x] Strong password for MongoDB admin user
- [ ] `.env` files have restricted permissions:

```bash
chmod 600 /var/www/skills/module-c/.env
chmod 600 /var/www/skills/module-d/.env
```

---

## 15. Part 13: MongoDB Backup & Maintenance

### Manual Backup (All Databases)

```bash
# Create backup directory
mkdir -p /home/ubuntu/backups

# Backup ALL databases
mongodump --uri="mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/?authSource=admin" \
  --out=/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)

# Without auth:
# mongodump --out=/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)
```

### Backup a Specific Database

```bash
# Backup only module_d
mongodump --uri="mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/module_d?authSource=admin" \
  --out=/home/ubuntu/backups/module_d_$(date +%Y%m%d)
```

### Restore from Backup

```bash
# Restore ALL databases from a backup
mongorestore --uri="mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/?authSource=admin" \
  /home/ubuntu/backups/20260329_120000/

# Restore a specific database
mongorestore --uri="mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/?authSource=admin" \
  --db=module_d /home/ubuntu/backups/module_d_20260329/module_d/
```

### Automatic Daily Backups (Cron Job)

```bash
# Create a backup script
nano /home/ubuntu/backup-mongodb.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_URI="mongodb://skillsadmin:ChangeThisToAStrongPassword123!@localhost:27017/?authSource=admin"

# Create backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# Delete backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

echo "Backup completed: $BACKUP_DIR/$DATE"
```

```bash
# Make it executable
chmod +x /home/ubuntu/backup-mongodb.sh

# Add to crontab (runs daily at 2 AM)
crontab -e
```

Add this line at the bottom:
```
0 2 * * * /home/ubuntu/backup-mongodb.sh >> /home/ubuntu/backups/backup.log 2>&1
```

Save and exit.

### Check MongoDB Disk Usage

```bash
# Connect to mongosh
mongosh -u "skillsadmin" -p "ChangeThisToAStrongPassword123!" --authenticationDatabase admin
```

```javascript
// Check each database size
use module_c
db.stats()

use module_d
db.stats()

// Check all databases
db.adminCommand({ listDatabases: 1 })

exit
```

### MongoDB Performance Tuning (For t2.medium)

```bash
sudo nano /etc/mongod.conf
```

Add/modify the storage section:
```yaml
storage:
  dbPath: /var/lib/mongodb
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
```

> Setting `cacheSizeGB: 1` limits MongoDB to use 1GB RAM max, leaving room for Node.js apps.

```bash
sudo systemctl restart mongod
```

---

## 16. Part 14: Monitoring & Maintenance

### Daily Health Check Commands

```bash
# Check all services are running
sudo systemctl status mongod --no-pager    # MongoDB
sudo systemctl status nginx --no-pager     # Nginx
pm2 list                                    # Node.js apps

# Check disk space
df -h

# Check memory usage
free -m

# Check MongoDB is responding
mongosh --eval "db.runCommand({ping: 1})" --quiet
# Should output: { ok: 1 }
```

### View Logs

```bash
# MongoDB logs
sudo tail -50 /var/log/mongodb/mongod.log

# Nginx access log
sudo tail -50 /var/log/nginx/access.log

# Nginx error log
sudo tail -50 /var/log/nginx/error.log

# PM2 logs (all apps)
pm2 logs --lines 50

# PM2 logs (specific app)
pm2 logs module-c --lines 50
```

### Adding Swap Space (If Running Low on Memory)

```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent (survives reboot)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -m
# Should show Swap: 2048
```

### Updating Your Code

```bash
# After uploading new files via SCP/FileZilla:
pm2 restart module-c     # Restart the app that changed
pm2 restart all           # Or restart everything

# If dependencies changed:
cd /var/www/skills/module-c
npm install
pm2 restart module-c
```

---

## 17. Troubleshooting

### Problem: MongoDB won't start

```bash
# Check the error
sudo systemctl status mongod
sudo tail -20 /var/log/mongodb/mongod.log

# Common fix: data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo systemctl restart mongod

# If "Address already in use"
sudo lsof -i :27017
# Kill the process and restart
sudo systemctl restart mongod
```

### Problem: "MongoServerError: Authentication failed"

```bash
# Your username/password is wrong. Reset it:
# First, disable auth temporarily
sudo nano /etc/mongod.conf
# Comment out: #  authorization: enabled
sudo systemctl restart mongod

# Connect without auth and fix the user
mongosh
use admin
db.dropUser("skillsadmin")
db.createUser({
  user: "skillsadmin",
  pwd: "YourNewPassword",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
exit

# Re-enable auth
sudo nano /etc/mongod.conf
# Uncomment: authorization: enabled
sudo systemctl restart mongod
```

### Problem: "502 Bad Gateway" from Nginx

```bash
# The Node.js app crashed or isn't running
pm2 list                   # Check status
pm2 logs module-c          # Check errors
pm2 restart module-c       # Try restarting

# Verify the app is listening on the right port
curl http://localhost:3003  # Test directly
```

### Problem: "Cannot connect to MongoDB" from Node.js app

```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
cat /var/www/skills/module-c/.env

# Test connection manually
mongosh "mongodb://skillsadmin:YOUR_PASSWORD@localhost:27017/module_c?authSource=admin"

# If using auth, make sure ?authSource=admin is in the URI
```

### Problem: "Out of memory - app keeps restarting"

```bash
# Check memory
free -m

# Add swap space (see Monitoring section)
# Or reduce MongoDB cache size in /etc/mongod.conf

# Or upgrade EC2 instance:
# AWS Console > EC2 > Instance > Stop > Change Instance Type > Start
```

### Problem: "ENOSPC: no space left on device"

```bash
# Check disk usage
df -h

# Find large files
du -sh /var/www/skills/*
du -sh /var/lib/mongodb

# Clean up old backups
rm -rf /home/ubuntu/backups/old_backup_dir

# Clean npm cache
npm cache clean --force

# Clean apt cache
sudo apt clean
```

### Problem: "Permission denied" errors

```bash
sudo chown -R ubuntu:ubuntu /var/www/skills/
sudo chmod -R 755 /var/www/skills/
```

---

## 18. Quick Reference Cheat Sheet

### URLs After Deployment

| Module | URL |
|--------|-----|
| Landing Page | `http://YOUR_EC2_IP/` |
| Module A - Speed Tasks | `http://YOUR_EC2_IP/speed-tasks/` |
| Module A - Chat API | `http://YOUR_EC2_IP/api/chat/` |
| Module A - Excel API | `http://YOUR_EC2_IP/api/excel/` |
| Module A - Calendar API | `http://YOUR_EC2_IP/api/calendar/` |
| Module B - Slideshow | `http://YOUR_EC2_IP/slideshow/` |
| Module C - Music API | `http://YOUR_EC2_IP/api/music/` |
| Module D - Tourism | `http://YOUR_EC2_IP/tourism/` |

### Port Mapping

| Service | Port | Accessed Via |
|---------|------|-------------|
| **MongoDB** | **27017** | **localhost only (NOT exposed to internet)** |
| Module A - Chat | 8080 | Nginx proxy |
| Module A - Calendar | 3000 | Nginx proxy |
| Module A - Excel | 3001 | Nginx proxy |
| Module A - CORS | 3002 | Nginx proxy |
| Module C - Music API | 3003 | Nginx proxy |
| Module D - Tourism | 3004 | Nginx proxy |
| Nginx | 80/443 | Direct from internet |

### MongoDB Connection Strings (Local)

```bash
# WITH authentication:
mongodb://skillsadmin:YOUR_PASSWORD@localhost:27017/DATABASE_NAME?authSource=admin

# WITHOUT authentication:
mongodb://localhost:27017/DATABASE_NAME

# Database names:
# module_a_excel, module_a_calendar, module_c, module_d
```

### Essential Commands

```bash
# ---- MongoDB ----
sudo systemctl status mongod        # Check MongoDB status
sudo systemctl restart mongod        # Restart MongoDB
mongosh                              # Connect to MongoDB shell
sudo tail -f /var/log/mongodb/mongod.log  # Watch MongoDB logs

# ---- PM2 (Node.js Apps) ----
pm2 list                             # View all running apps
pm2 restart all                      # Restart all apps
pm2 logs                             # View all logs (live)
pm2 monit                            # Real-time CPU/Memory

# ---- Nginx ----
sudo nginx -t                        # Test config syntax
sudo systemctl restart nginx         # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # Watch error logs

# ---- System ----
free -m                              # Check memory
df -h                                # Check disk space
htop                                 # System monitor (sudo apt install htop)

# ---- Backups ----
mongodump --out=/home/ubuntu/backups/$(date +%Y%m%d)  # Backup all DBs
mongorestore /home/ubuntu/backups/20260329/            # Restore from backup
```

### Complete Deployment Order (Fresh Start)

```
 1. Launch EC2 instance (Ubuntu 22.04, t2.medium, 25GB storage)
 2. Connect via SSH
 3. sudo apt update && sudo apt upgrade -y
 4. Install Node.js 20
 5. Install Nginx
 6. Install PM2
 7. Install Git
 8. *** Install MongoDB 7.0 on the VM ***
 9. *** Start MongoDB & enable auto-start ***
10. *** Create MongoDB admin user ***
11. *** Enable MongoDB authentication ***
12. Create directory structure (/var/www/skills/...)
13. Upload all module files (SCP / FileZilla / Git)
14. For each module with backend:
    a. npm install
    b. Configure .env with mongodb://localhost:27017/...
    c. Update server port if needed
    d. Run seed scripts if available
    e. Test: node server.js
    f. Start with PM2: pm2 start server.js --name "module-x"
15. pm2 save && pm2 startup
16. Configure Nginx reverse proxy
17. Create landing page
18. (Optional) Domain + SSL with Certbot
19. Configure UFW firewall
20. Set up MongoDB backup cron job
21. DONE!
```

### Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| EC2 t2.medium | ~$34/month |
| MongoDB | **$0** (self-hosted) |
| Domain (optional) | ~$1/month |
| **Total** | **~$34-35/month** |

> With t2.micro (free tier): **$0/month for 12 months** but may be too slow with MongoDB + 6 apps.
> Add 2GB swap space to help with memory on t2.micro.

---

> **Congratulations!** Your entire Skills Protocol system is now running on a single EC2 instance
> with MongoDB installed locally. No cloud database service needed - everything is self-contained.

---

*Guide created for India Skills / WorldSkills Protocol deployment*
*MongoDB: Self-hosted on EC2 VM (not Atlas)*
*Last updated: March 2026*
