# Deployment Structure & Strategy

## Target Environment
- Production cluster running Docker containers orchestrated via Docker Compose or Kubernetes.
- Nginx reverse proxy managing SSL termination and dynamic tenant domain routing.
- MongoDB Atlas or self-hosted replica set with automated point-in-time recovery.
- Object storage (S3-compatible) for salon gallery images, invoices, and certificates.
