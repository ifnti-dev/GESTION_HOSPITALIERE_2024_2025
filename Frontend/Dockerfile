# Étape 1 : Utiliser Ubuntu comme image de base
FROM ubuntu:22.04

# Éviter les prompts interactifs pendant l'installation
ENV DEBIAN_FRONTEND=noninteractive

# Étape 2 : Installer Node.js, npm, et Angular CLI
RUN apt-get update && \
    apt-get install -y curl gnupg2 ca-certificates build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @angular/cli

# Étape 3 : Définir le dossier de travail
WORKDIR /app

# Étape 4 : Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install

# Étape 5 : Copier le reste du code
COPY . .

# Étape 6 : Exposer le port du serveur Angular
EXPOSE 4200

# Étape 7 : Démarrer l'application en mode développement
CMD ["ng", "serve", "--host", "0.0.0.0"]

