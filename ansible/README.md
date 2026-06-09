# Ansible Provisioning

This directory contains the Ansible configuration used to provision the VPS for the Task Management DevOps Platform.

## Purpose

The playbook prepares a fresh Ubuntu VPS by installing and configuring:

- Base Linux packages
- Docker
- K3s Kubernetes
- Helm
- UFW firewall
- deploy user
- Kubernetes kubeconfig for root and deploy users
- Project directory under `/srv/task-management-devops-platform`

## Inventory

Example:

```ini
[vps]
ash ansible_host=YOUR_VPS_IP ansible_user=root