Gitbash
Gitdesktop
mongoose compass
mongoose community server
node modules

prettier
live server

# EC2 MERN Deployment Guide (India Skills Modules)

This is a complete step-by-step guide starting from SSH connection to hosting multiple modules with Nginx.

---

# 1. Connect to EC2

Open PowerShell:

```
cd ~/Downloads
ssh -i aws-ec2-key.pem ec2-user@<your-public-dns>
```

---

# 2. Update System

```
sudo yum update -y
```

---

# 3. Install Node.js

```
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
node -v
npm -v
```

---

# 4. Install MongoDB

```
sudo rm -f /etc/yum.repos.d/mongodb-org-7.0.repo

sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

sudo yum clean all
sudo yum makecache
sudo yum install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

---

# 5. Install Git, Nginx, PM2

```
sudo yum install -y git nginx
sudo npm install -g pm2
```

---

# 6. Clone All Module Repositories

```
cd ~

# Replace with your repo URLs

git clone <MODULE_A_REPO_URL> 01_module_a
git clone <MODULE_B_REPO_URL> 02_module_b
git clone <MODULE_C_REPO_URL> module-c
git clone <MODULE_D_REPO_URL> module-d
```

---

# 7. Setup Backend - Module C

```
cd ~/module-c
npm install

echo "MONGO_URI=mongodb://localhost:27017/module-c" > .env
```

Edit server.js:

```
const PORT = process.env.PORT || 3001;
```

Run:

```
pm2 start server.js --name module-c
```

---

# 8. Setup Backend - Module D

```
cd ~/module-d
npm install

echo "MONGO_URI=mongodb://localhost:27017/module-d" > .env
npm run seed
```

Edit server.js:

```
const PORT = process.env.PORT || 3002;
```

Run:

```
pm2 start server.js --name module-d
```

---

# 9. Save PM2 Processes

```
pm2 save
pm2 startup
```

Run the command it gives after pm2 startup.

---

# 10. Configure Nginx

```
sudo nano /etc/nginx/conf.d/modules.conf
```

Paste:

```
server {
    listen 80;
    server_name _;

    location /01_module_a/ {
        alias /home/ec2-user/01_module_a/;
        index index.html;
    }

    location /02_module_b/ {
        alias /home/ec2-user/02_module_b/;
        index index.html;
    }

    location /api/c/ {
        proxy_pass http://localhost:3001/;
    }

    location /api/d/ {
        proxy_pass http://localhost:3002/;
    }
}
```

Apply config:

```
sudo nginx -t
sudo systemctl restart nginx
```

---

# 11. Open Ports in AWS

Go to Security Group → Inbound Rules:

- HTTP (80) → 0.0.0.0/0
- HTTPS (443) → 0.0.0.0/0
- SSH (22) → Already enabled

---

# 12. Final URLs

```
http://<your-public-dns>/01_module_a/
http://<your-public-dns>/02_module_b/
http://<your-public-dns>/api/c/
http://<your-public-dns>/api/d/
```

---

# Notes

- Ensure frontend uses correct base paths
- Use relative API URLs if possible
- Restart services if changes don’t reflect

---

# Done

Your full multi-module deployment is now live.
