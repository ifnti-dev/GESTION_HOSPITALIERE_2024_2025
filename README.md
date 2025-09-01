# Système de Gestion Hospitalière

Ce projet est une application complète de gestion hospitalière avec un backend Spring Boot et un frontend Next.js.

## Prérequis

- Docker
- Docker Compose


## consulter la db

# Se connecter au conteneur de la base de données
docker compose exec db psql -U nom_utilisateur -d hospital_db

# Une fois connecté, vous pouvez exécuter des commandes SQL
# Lister toutes les tables
\dt

# Voir le contenu d'une table spécifique
SELECT * FROM nom_de_la_table;

# Voir les utilisateurs créés
SELECT * FROM pg_user;

# Quitter psql
\q

## en cas d'erreur de connection

descendez le volume et remontez un db fraiche 

docker-compose down --volumes

docker-compose up --build




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
