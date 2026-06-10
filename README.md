# Task Management DevOps Platform

A DevOps-focused deployment project for a Task Management application.

This project demonstrates how a full-stack application can be containerized, deployed, automated, monitored, and provisioned using modern DevOps tools and practices.

---

## Live Demo

| Service | URL |
|---|---|
| Application | https://www.coddit.ir/ |
| Grafana | https://grafana.coddit.ir/login |
| Prometheus | https://prometheus.coddit.ir/query |

The application is deployed on a VPS and exposed through an `.ir` domain using Cloudflare routing.

> Note: In a production environment, monitoring tools such as Grafana and Prometheus should be protected and not exposed publicly without authentication and access control.

---

## Overview

The project includes a frontend, backend API, PostgreSQL database, Redis service, Kubernetes deployment, CI/CD pipeline, monitoring stack, and infrastructure provisioning.

The main goal of this project is to demonstrate the DevOps lifecycle around an application:

- Containerization with Docker
- Local orchestration with Docker Compose
- Automated CI/CD with GitHub Actions
- Kubernetes deployment with K3s
- Domain routing with Cloudflare and Ingress
- Monitoring with Prometheus and Grafana
- Server provisioning with Ansible

---

## Architecture

```text
User
  |
  v
Cloudflare / Domain Routing
  |
  v
Ingress Controller
  |
  v
Frontend Service
  |
  v
Frontend Pods
  |
  v
Backend Service
  |
  v
Backend Pods
  |
  +------------------> PostgreSQL Service
  |                         |
  |                         v
  |                  PostgreSQL StatefulSet + PVC
  |
  +------------------> Redis Service

Monitoring:
Prometheus collects metrics from Kubernetes, nodes, pods, and services.
Grafana visualizes the collected metrics through dashboards.

CI/CD:
GitHub Actions builds Docker images, pushes them to Docker Hub, connects to the VPS, applies Kubernetes manifests, and restarts deployments.

Provisioning:
Ansible prepares the VPS environment and installs required tools.
```

---

## Tech Stack

### Application

- Frontend: React / Vite
- Backend: FastAPI / Python
- Database: PostgreSQL
- Cache: Redis

### DevOps

- Docker
- Docker Compose
- Docker Hub
- GitHub Actions
- Kubernetes / K3s
- Traefik / Ingress
- Cloudflare
- Prometheus
- Grafana
- Helm
- Ansible

---

## Repository Structure

```text
.
├── backend/
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── k8s/
│   ├── backend/
│   ├── frontend/
│   ├── database/
│   ├── redis/
│   ├── namespaces/
│   └── ingress/
│
├── ansible/
│   ├── inventory.example.ini
│   ├── inventory.ini
│   └── playbook.yml
│
├── .github/
│   └── workflows/
│
└── docker-compose.yml
```

> The real `ansible/inventory.ini` file should not be committed if it contains a real VPS IP address or private server information. Use `inventory.example.ini` as a safe template.

---

## Local Development

The project includes a `docker-compose.yml` file in the root directory for local development and testing.

Run the full application stack locally:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

Stop the stack:

```bash
docker compose down
```

---

## Dockerization

Both frontend and backend services include their own Dockerfiles.

### Backend

The backend Dockerfile builds the FastAPI application image.

Key points:

- Python-based image
- Installs dependencies from `requirements.txt`
- Runs the application with Uvicorn/Gunicorn
- Uses environment variables for external services
- Includes healthcheck support
- Runs as a non-root user

Build the backend image manually:

```bash
docker build -t task-backend:local ./backend
```

### Frontend

The frontend Dockerfile uses a multi-stage build.

Key points:

- Node.js is used to build the React/Vite application
- Nginx is used to serve the production static files
- The final runtime image does not need Node.js
- Includes custom Nginx configuration
- Runs as a non-root user
- Includes healthcheck support

Build the frontend image manually:

```bash
docker build -t task-frontend:local ./frontend
```

---

## CI/CD Pipeline

GitHub Actions is used for CI/CD.

The pipeline is triggered when changes are pushed to the main branch.

CI/CD flow:

```text
Push to GitHub
  |
  v
GitHub Actions workflow starts
  |
  v
Build backend Docker image
  |
  v
Build frontend Docker image
  |
  v
Push images to Docker Hub
  |
  v
Connect to VPS using SSH
  |
  v
Update project files on VPS
  |
  v
Apply Kubernetes manifests
  |
  v
Restart backend and frontend deployments
```

GitHub Secrets are used to store sensitive values such as:

- Docker Hub username
- Docker Hub token
- VPS host
- VPS user
- SSH private key

---

## Kubernetes Deployment

The application is deployed on a K3s Kubernetes cluster running on a VPS.

Application resources are deployed in the `production` namespace.

Monitoring resources are deployed in the `monitoring` namespace.

Kubernetes resources include:

- Namespace
- Deployments
- StatefulSet
- Services
- ConfigMaps
- Secrets
- PersistentVolumeClaim
- Ingress
- Liveness probes
- Readiness probes

### Frontend

The frontend runs as a Kubernetes Deployment and is exposed through a Service and Ingress.

### Backend

The backend runs as a Kubernetes Deployment and connects to PostgreSQL and Redis using internal Kubernetes service names.

### PostgreSQL

PostgreSQL runs as a StatefulSet with persistent storage.

A PersistentVolumeClaim is used to keep database data persistent across pod restarts.

### Redis

Redis is deployed inside the Kubernetes cluster and is available to the backend through a Kubernetes Service.

### Ingress and Domain

The application is exposed using Ingress and Cloudflare routing.

Public application URL:

```text
https://www.coddit.ir/
```

---

## Monitoring

Monitoring is implemented with Prometheus and Grafana.

The monitoring stack is deployed in the `monitoring` namespace.

Prometheus collects metrics from:

- Kubernetes nodes
- Pods
- Deployments
- StatefulSets
- Services
- node-exporter
- kube-state-metrics

Grafana is used to visualize metrics through dashboards.

Dashboards include:

- VPS CPU usage
- VPS memory usage
- VPS disk usage
- Kubernetes pod status
- Deployment available replicas
- StatefulSet ready replicas
- Pod restarts
- Backend resource usage
- Frontend resource usage
- PostgreSQL and Redis resource usage

Access Grafana:

```text
https://grafana.coddit.ir/login
```

Access Prometheus:

```text
https://prometheus.coddit.ir/query
```

Port-forward access can also be used:

```bash
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
```

```bash
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring
```

---

## Ansible Provisioning

Ansible is used to automate VPS provisioning.

The purpose of Ansible in this project is to make the server setup repeatable and documented.

Provisioning tasks include:

- Installing base packages
- Creating users and directories
- Installing Docker
- Installing K3s
- Configuring kubectl access
- Installing Helm
- Preparing the VPS for deployment

Test Ansible connection:

```bash
ansible all -i ansible/inventory.ini -m ping
```

Run the playbook:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Ansible prepares the server, while GitHub Actions handles application deployment.

---

## Environment Variables and Secrets

The project uses Kubernetes Secrets and ConfigMaps to manage configuration.

Secrets are used for sensitive values:

- PostgreSQL username
- PostgreSQL password
- Database URL

ConfigMaps are used for non-sensitive values:

- Redis host
- Redis port
- Application configuration

This keeps configuration separate from application code.

---

## Useful Commands

Check cluster nodes:

```bash
kubectl get nodes
```

Check all pods:

```bash
kubectl get pods -A
```

Check production resources:

```bash
kubectl get pods -n production
kubectl get svc -n production
kubectl get ingress -n production
kubectl get pvc -n production
```

Check monitoring resources:

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

View backend logs:

```bash
kubectl logs deployment/backend -n production
```

View PostgreSQL logs:

```bash
kubectl logs statefulset/postgres -n production
```

Restart backend and frontend:

```bash
kubectl rollout restart deployment/backend -n production
kubectl rollout restart deployment/frontend -n production
```

Check rollout status:

```bash
kubectl rollout status deployment/backend -n production
kubectl rollout status deployment/frontend -n production
```

Check resource usage:

```bash
kubectl top nodes
kubectl top pods -A
```

---

## API

The backend exposes FastAPI endpoints.

Swagger UI:

```text
https://www.coddit.ir/docs
```

OpenAPI JSON:

```text
https://www.coddit.ir/openapi.json
```

Example endpoints:

```text
GET  /api/tasks/
POST /api/tasks/
GET  /health
```

Example request:

```bash
curl https://www.coddit.ir/api/tasks/
```

Create a task:

```bash
curl -X POST https://www.coddit.ir/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","status":"pending","owner_id":1}'
```

---

## Troubleshooting Notes

### PostgreSQL Probe Issue

PostgreSQL logs showed:

```text
FATAL: database "myuser" does not exist
```

The cause was that `pg_isready` was checking only the user and not the database.

Incorrect:

```bash
pg_isready -U $POSTGRES_USER
```

Correct:

```bash
pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
```

PostgreSQL defaults the database name to the username if no database is specified.

### Frontend Build Issue on VPS

The frontend Docker build worked locally but failed on the VPS with:

```text
npm error code ECONNRESET
npm error network read ECONNRESET
```

This was related to network instability during npm package download inside Docker on the VPS.

Useful checks:

```bash
docker run --rm node:20-bookworm-slim npm config get registry
```

```bash
docker run --rm node:20-bookworm-slim npm view react version
```

A useful workaround:

```bash
docker build --network=host --no-cache --progress=plain -t task-frontend:local ./frontend
```

---

## Project Status

| Section | Status |
|---|---|
| Dockerization | Completed |
| Docker Compose | Completed |
| GitHub Actions CI/CD | Completed |
| Kubernetes Deployment | Completed |
| Ingress and Cloudflare Routing | Completed |
| Prometheus Monitoring | Completed |
| Grafana Dashboards | Completed |
| Ansible Provisioning | Completed |

---

## Authors

DevOps Bootcamp Final Project  
Task Management DevOps Platform