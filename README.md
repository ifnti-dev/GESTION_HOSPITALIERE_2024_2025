# Système de Gestion Hospitalière

Ce projet est une application complète de gestion hospitalière avec un backend Spring Boot et un frontend Next.js.

## Prérequis

- Docker
- Docker Compose

## Installation et lancement

1. Clonez le projet
2. Placez-vous à la racine du projet
3. Exécutez la commande : 
   ```bash
   docker compose up --build

## Architecture du projet
projet-root/
├── gestion_hospitaliaire_frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (le reste de votre projet Next.js)
├── GESTION_HOSPITALIRE_BACKEND/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (le reste de votre projet Spring Boot)
├── docker-compose.yml
├── .env
└── README.md
