# Docker Deployment Guide for HA Food Next.js

This guide will help you deploy your HA Food Next.js application using Docker with an external Railway database.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Git (to clone the repository)
- Railway database connection (already configured)

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Build the Docker image
./deploy.sh build

# Run the application
./deploy.sh run

# View logs
./deploy.sh logs

# Stop the application
./deploy.sh stop
```

### 2. Manual Docker Commands

```bash
# Build the image
docker-compose build

# Run the application
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down
```

## Environment Variables Setup (SECURE)

⚠️ **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive information.

### 1. Create your `.env` file

Copy the example file and fill in your actual values:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual values
nano .env
```

### 2. Required Environment Variables

Your `.env` file should contain:

```env
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://postgres:YHGtCWMJXBvXliNwpsrieKdxnDHwQnco@gondola.proxy.rlwy.net:37432/ha-food

# Application Configuration (REQUIRED)
NODE_ENV=production

# JWT Configuration (REQUIRED for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# NextAuth Configuration (if using)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 3. Security Best Practices

- ✅ **Use `.env` file** - Never hardcode credentials in docker-compose.yml
- ✅ **Add `.env` to `.gitignore** - Prevent accidental commits
- ✅ **Use strong secrets** - Generate random strings for JWT_SECRET
- ✅ **Rotate credentials** - Regularly update database passwords
- ✅ **Limit access** - Only share credentials with authorized team members

## Database Setup

Your application is configured to use the Railway PostgreSQL database. The connection details are stored securely in your `.env` file.

### Running Database Migrations

Since you're using an external database, you can run migrations directly:

```bash
# Run migrations locally (if you have the database connection)
npx prisma migrate deploy

# Or run migrations inside the Docker container
docker-compose exec app npx prisma migrate deploy

# Seed the database (if you have seed scripts)
docker-compose exec app npx prisma db seed
```

## Production Deployment

### 1. Using Docker Compose (Recommended for small to medium deployments)

```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up -d --build
```

### 2. Using Docker directly

```bash
# Build the image
docker build -t ha-food-next .

# Run the container with .env file
docker run -d \
  --name ha-food-app \
  -p 3000:3000 \
  --env-file .env \
  ha-food-next
```

## Docker Commands Reference

### Build Commands

```bash
# Build the image
docker build -t ha-food-next .

# Build with no cache
docker build --no-cache -t ha-food-next .
```

### Run Commands

```bash
# Run in detached mode with .env file
docker run -d --env-file .env -p 3000:3000 ha-food-next

# Run with volume mounts (for development)
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd):/app \
  ha-food-next
```

### Management Commands

```bash
# List running containers
docker ps

# Stop a container
docker stop container_id

# Remove a container
docker rm container_id

# View logs
docker logs container_id

# Execute commands in running container
docker exec -it container_id sh
```

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using port 3000
   lsof -i :3000

   # Kill the process or change the port in docker-compose.yml
   ```

2. **Database connection issues**

   ```bash
   # Check if the container can reach the database
   docker-compose exec app npx prisma db push

   # Check application logs
   docker-compose logs -f app

   # Verify .env file exists and has correct DATABASE_URL
   cat .env
   ```

3. **Build failures**

   ```bash
   # Clean up and rebuild
   docker-compose down
   docker system prune -f
   docker-compose build --no-cache
   ```

4. **Permission issues**

   ```bash
   # Make sure the deployment script is executable
   chmod +x deploy.sh
   ```

5. **Environment variable issues**

   ```bash
   # Check if .env file exists
   ls -la .env

   # Verify environment variables are loaded
   docker-compose exec app env | grep DATABASE_URL
   ```

### Logs and Debugging

```bash
# View application logs
docker-compose logs -f app

# View all logs
docker-compose logs -f

# Access container shell
docker-compose exec app sh

# Test database connection from container
docker-compose exec app npx prisma db push

# Check environment variables in container
docker-compose exec app env
```

## Performance Optimization

### 1. Multi-stage Build

The Dockerfile uses multi-stage builds to optimize image size:

- `deps` stage: Installs dependencies
- `builder` stage: Builds the application
- `runner` stage: Production runtime

### 2. Standalone Output

The Next.js configuration includes `output: 'standalone'` which creates a minimal production build.

### 3. Alpine Linux

Using Alpine Linux base image for smaller size and better security.

## Security Considerations

1. **Environment Variables**: ✅ Using `.env` file (secure)
2. **Database Credentials**: ✅ Stored in `.env` file (secure)
3. **Network Security**: Configure firewalls and network policies
4. **Image Scanning**: Regularly scan Docker images for vulnerabilities
5. **Secret Management**: Consider using Docker secrets or external secret managers for production

## Monitoring

### Health Checks

Add health checks to your docker-compose.yml:

```yaml
services:
  app:
    # ... other configuration
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Logging

Configure logging drivers for production:

```yaml
services:
  app:
    # ... other configuration
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Railway Database Management

Since you're using Railway for your database:

### Backup and Recovery

```bash
# Create backup using Railway CLI
railway connect
pg_dump -h gondola.proxy.rlwy.net -p 37432 -U postgres -d ha-food > backup.sql

# Restore backup
psql -h gondola.proxy.rlwy.net -p 37432 -U postgres -d ha-food < backup.sql
```

### Database Monitoring

- Use Railway dashboard to monitor database performance
- Check connection limits and usage
- Monitor query performance

## Support

If you encounter any issues with the Docker deployment, please:

1. Check the logs: `docker-compose logs -f`
2. Verify `.env` file exists and has correct values
3. Ensure all prerequisites are installed
4. Check the troubleshooting section above
5. Verify Railway database connectivity

For additional help, refer to the Docker, Next.js, and Railway documentation.
