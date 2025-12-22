# Docker Setup Guide for ThiruSu Juice Shop

This guide will help you run the entire application stack (Frontend + Backend + Database) using Docker.

## Prerequisites

- Docker Desktop installed (Windows/Mac/Linux)
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` file with your configurations (especially the database password and JWT secret).

### 2. Build and Run

Start all services:

```bash
docker-compose up -d
```

This will:
- Create a PostgreSQL database container
- Build and start the backend API
- Build and start the frontend React app with Nginx

### 3. Initialize Database

After the containers are running, initialize the database:

```bash
# Access the backend container
docker exec -it juice-shop-backend sh

# Run database setup
npm run db:setup

# Seed initial data
npm run db:seed

# Exit the container
exit
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **PostgreSQL**: localhost:5432

## Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete all data)

```bash
docker-compose down -v
```

### Rebuild Containers

If you make changes to the code:

```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Execute Commands in Containers

```bash
# Backend container
docker exec -it juice-shop-backend sh

# Frontend container
docker exec -it juice-shop-frontend sh

# Database container
docker exec -it juice-shop-db psql -U postgres -d juice_shop
```

## Development vs Production

### Development Mode

For development, you might want to use volume mounting for hot-reload:

```bash
# Start with development override
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production Mode

The default `docker-compose.yml` is configured for production with:
- Optimized builds
- Health checks
- Auto-restart policies
- Security headers

## Troubleshooting

### Port Already in Use

If ports 80, 5000, or 5432 are already in use, edit `docker-compose.yml` to change the port mappings:

```yaml
ports:
  - "8080:80"    # Frontend (change 8080 to any available port)
  - "5001:5000"  # Backend (change 5001 to any available port)
  - "5433:5432"  # PostgreSQL (change 5433 to any available port)
```

### Database Connection Issues

Make sure the PostgreSQL container is healthy:

```bash
docker-compose ps
```

Check backend logs:

```bash
docker-compose logs backend
```

### Frontend Can't Connect to Backend

Verify the API URL in the frontend build. The nginx configuration proxies `/api` requests to the backend.

### Rebuild After Changes

After modifying code, rebuild the affected service:

```bash
docker-compose up -d --build backend
# or
docker-compose up -d --build frontend
```

## Container Management

### View Running Containers

```bash
docker ps
```

### View All Containers

```bash
docker ps -a
```

### Remove Stopped Containers

```bash
docker-compose down --remove-orphans
```

### Clean Up Everything

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove unused images
docker image prune -a
```

## Database Backups

### Create Backup

```bash
docker exec juice-shop-db pg_dump -U postgres juice_shop > backup.sql
```

### Restore Backup

```bash
docker exec -i juice-shop-db psql -U postgres juice_shop < backup.sql
```

## Security Notes

1. **Change default passwords** in `.env` file
2. **Use strong JWT_SECRET** for production
3. **Don't commit `.env`** file to version control
4. **Use environment-specific** configurations
5. **Enable HTTPS** in production with a reverse proxy (e.g., Nginx, Traefik)

## Next Steps

1. Configure your email settings in `.env`
2. Set up proper domain and SSL certificates for production
3. Configure monitoring and logging
4. Set up automated backups for the database
5. Implement CI/CD pipeline for automated deployments

## Support

For issues or questions, refer to:
- Main README.md
- Backend README.md
- Docker documentation: https://docs.docker.com/
