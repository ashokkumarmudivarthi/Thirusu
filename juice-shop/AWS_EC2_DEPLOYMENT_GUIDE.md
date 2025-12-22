# ThiruSu Juice Shop - AWS EC2 Deployment Guide

## Prerequisites
- AWS Account with EC2 access
- SSH client (PuTTY for Windows or native SSH for Linux/Mac)
- Project files and database dump

---

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance
1. Log in to AWS Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Configure instance:
   - **Name**: `juice-shop-server`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t2.medium or t3.medium (minimum 2GB RAM)
   - **Key Pair**: Create new or select existing key pair (save .pem file securely)
   - **Network Settings**:
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere
     - Allow Custom TCP (port 5000) from anywhere
     - Allow Custom TCP (port 5432) from anywhere (optional, for DB access)

### 1.2 Security Group Rules
```
Type            Protocol    Port Range    Source
SSH             TCP         22            Your IP/0.0.0.0/0
HTTP            TCP         80            0.0.0.0/0
Custom TCP      TCP         5000          0.0.0.0/0
Custom TCP      TCP         5432          0.0.0.0/0 (optional)
```

---

## Step 2: Connect to EC2 Instance

### For Windows (using PuTTY)
```bash
# Convert .pem to .ppk using PuTTYgen
# Use PuTTY to connect with the .ppk file
```

### For Linux/Mac
```bash
# Set permissions for your key
chmod 400 /path/to/your-key.pem

# Connect to EC2
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

---

## Step 3: Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# IMPORTANT: Log out and log back in for group changes to take effect
exit
# Then SSH back in
```

---

## Step 4: Transfer Project Files to EC2

### Option A: Using Git (Recommended)
```bash
# Install git
sudo apt install -y git

# Clone your repository
git clone <your-repo-url>
cd juice-shop
```

### Option B: Using SCP (if no Git repo)
```bash
# From your local machine (Windows PowerShell/Linux/Mac Terminal)
# Compress the project folder
tar -czf juice-shop.tar.gz juice-shop/

# Transfer to EC2
scp -i /path/to/your-key.pem juice-shop.tar.gz ubuntu@<your-ec2-public-ip>:~/

# On EC2, extract the files
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
tar -xzf juice-shop.tar.gz
cd juice-shop
```

### Option C: Using FileZilla/WinSCP
1. Use FileZilla or WinSCP with your .pem/.ppk key
2. Upload the entire `juice-shop` folder to `/home/ubuntu/`

---

## Step 5: Upload Database Dump

```bash
# On EC2, navigate to project directory
cd ~/juice-shop

# If dump file is not in project, upload it using SCP from local machine:
# scp -i /path/to/your-key.pem dump-thirusu-202512222257.sql ubuntu@<your-ec2-public-ip>:~/juice-shop/

# Verify the dump file exists
ls -lh dump-thirusu-202512222257.sql
```

---

## Step 6: Configure Environment Variables

```bash
# Edit the .env file
nano .env

# Update these values:
```

```env
# Database Configuration
POSTGRES_DB=juice_shop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin

# Backend Configuration
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@juiceshop.com

# Environment
NODE_ENV=production
PORT=5000

# API URL for frontend - UPDATE THIS WITH YOUR EC2 PUBLIC IP
VITE_API_URL=http://<your-ec2-public-ip>:5000
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## Step 7: Update docker-compose.yml for Production

```bash
# Edit docker-compose.yml to ensure correct settings
nano docker-compose.yml
```

Verify these sections are correct:
```yaml
environment:
  CORS_ORIGIN: http://<your-ec2-public-ip>,http://<your-ec2-public-ip>:80
  # ... other settings
```

---

## Step 8: Build and Start Docker Containers

```bash
# Navigate to project directory
cd ~/juice-shop

# Build and start all containers
docker-compose up -d --build

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

Expected output:
```
NAME                  IMAGE                 STATUS              PORTS
juice-shop-backend    juice-shop-backend    Up                 0.0.0.0:5000->5000/tcp
juice-shop-db         postgres:16-alpine    Up (healthy)       0.0.0.0:5432->5432/tcp
juice-shop-frontend   juice-shop-frontend   Up                 0.0.0.0:80->80/tcp
```

---

## Step 9: Import Database Dump

```bash
# Copy dump file to PostgreSQL container
docker cp dump-thirusu-202512222257.sql juice-shop-db:/tmp/dump.sql.gz

# Access the database container
docker exec -it juice-shop-db /bin/sh

# Inside the container, decompress and import
gunzip /tmp/dump.sql.gz
psql -U postgres -d juice_shop -f /tmp/dump.sql

# Exit the container
exit

# Change postgres password to match configuration
docker exec juice-shop-db psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'admin';"

# Restart backend to reconnect with correct credentials
docker-compose restart backend
```

---

## Step 10: Verify Database Import

```bash
# Check tables
docker exec juice-shop-db psql -U postgres -d juice_shop -c "\dt"

# Check user count
docker exec -e PGPASSWORD=admin juice-shop-db psql -U postgres -d juice_shop -c "SELECT COUNT(*) FROM users;"

# Check products count
docker exec -e PGPASSWORD=admin juice-shop-db psql -U postgres -d juice_shop -c "SELECT COUNT(*) FROM products;"
```

---

## Step 11: Access Your Application

### Frontend
```
http://<your-ec2-public-ip>
```

### Backend API
```
http://<your-ec2-public-ip>:5000/api/health
```

### Test Login
- Email: `admin@thirusu.com`
- Email: `sureshkpt54@gmail.com`

---

## Step 12: Useful Docker Commands

```bash
# View all containers
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Stop all containers
docker-compose down

# Start all containers
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and volumes (CAUTION: This deletes data)
docker-compose down -v
```

---

## Step 13: Enable HTTPS (Optional - Using Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Step 14: Setup Auto-Start on Reboot

```bash
# Create systemd service file
sudo nano /etc/systemd/system/juice-shop.service
```

Add this content:
```ini
[Unit]
Description=ThiruSu Juice Shop Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/juice-shop
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ubuntu

[Install]
WantedBy=multi-user.target
```

```bash
# Enable the service
sudo systemctl enable juice-shop.service

# Start the service
sudo systemctl start juice-shop.service

# Check status
sudo systemctl status juice-shop.service
```

---

## Step 15: Monitoring and Maintenance

### Check Disk Space
```bash
df -h
docker system df
```

### Clean Up Docker Resources
```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove unused volumes (CAUTION: This may delete data)
docker volume prune
```

### Backup Database
```bash
# Create backup
docker exec juice-shop-db pg_dump -U postgres juice_shop | gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Download backup to local machine
scp -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>:~/backup-*.sql.gz ./
```

---

## Working Locally with VS Code and Docker

### Yes! You can work locally on VS Code with Docker

Your current setup already supports local development:

#### Start Locally
```bash
# In VS Code terminal (from juice-shop directory)
docker-compose up -d

# Access locally at
# Frontend: http://localhost
# Backend: http://localhost:5000
```

#### Stop Locally
```bash
docker-compose down
```

#### Edit Code
1. Edit files in VS Code
2. For backend changes:
   ```bash
   docker-compose restart backend
   ```
3. For frontend changes:
   ```bash
   docker-compose up -d --build frontend
   ```

#### Switch Between Local and EC2
- **Local**: Use `http://localhost` in `.env` for `VITE_API_URL`
- **EC2**: Use `http://<ec2-ip>:5000` in `.env` for `VITE_API_URL`

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs -f

# Remove and recreate
docker-compose down
docker-compose up -d --build
```

### Database Connection Error
```bash
# Check database password
docker exec juice-shop-db psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'admin';"

# Restart backend
docker-compose restart backend
```

### Port Already in Use
```bash
# Find process using port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000

# Kill process or change port in docker-compose.yml
```

### Out of Disk Space
```bash
# Check space
df -h

# Clean Docker
docker system prune -a
```

---

## Security Best Practices

1. **Change Default Passwords**
   - Update `POSTGRES_PASSWORD` in `.env`
   - Update `JWT_SECRET` to a strong random string

2. **Restrict Security Group**
   - Limit SSH access to your IP only
   - Use VPN for database access

3. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Regular Backups**
   - Schedule automatic database backups
   - Store backups in S3 or separate storage

5. **Use HTTPS**
   - Get SSL certificate with Let's Encrypt
   - Configure nginx for HTTPS

---

## Quick Deployment Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "=== ThiruSu Juice Shop Deployment ==="

# Navigate to project directory
cd ~/juice-shop

# Pull latest changes (if using Git)
# git pull origin main

# Stop running containers
docker-compose down

# Build and start containers
docker-compose up -d --build

# Wait for PostgreSQL to be ready
echo "Waiting for database to be ready..."
sleep 10

# Import database if dump exists
if [ -f "dump-thirusu-202512222257.sql" ]; then
    echo "Importing database dump..."
    docker cp dump-thirusu-202512222257.sql juice-shop-db:/tmp/dump.sql.gz
    docker exec juice-shop-db gunzip -f /tmp/dump.sql.gz
    docker exec juice-shop-db psql -U postgres -d juice_shop -f /tmp/dump.sql
    docker exec juice-shop-db psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'admin';"
fi

# Restart backend
docker-compose restart backend

# Show status
echo ""
echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "Backend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"
```

Make it executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Support & Logs

If you encounter issues, collect these logs:
```bash
# All logs
docker-compose logs > logs.txt

# System info
docker info > docker-info.txt
docker-compose ps > containers-status.txt
```

---

## Summary Checklist

- [ ] EC2 instance launched with correct security groups
- [ ] Docker and Docker Compose installed
- [ ] Project files uploaded to EC2
- [ ] Database dump uploaded
- [ ] `.env` file configured with correct values
- [ ] Containers built and running
- [ ] Database dump imported successfully
- [ ] Database password changed to 'admin'
- [ ] Application accessible via EC2 public IP
- [ ] Login tested and working
- [ ] Auto-start on reboot configured (optional)
- [ ] Backups configured (optional)

---

**Your application is now deployed on AWS EC2!** 🎉

Access it at: `http://<your-ec2-public-ip>`
