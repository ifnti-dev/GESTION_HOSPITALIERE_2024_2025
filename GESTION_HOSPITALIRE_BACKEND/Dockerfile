# Étape 1 : base Ubuntu + Java
FROM ubuntu:22.04

# Installer OpenJDK et autres outils nécessaires
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk curl maven && \
    apt-get clean

# Créer un utilisateur non-root 'admin'
RUN useradd -ms /bin/bash admin

# Créer un répertoire de travail
WORKDIR /app

# Copier le fichier JAR (généré par Maven dans le répertoire target)
COPY target/*.jar app.jar

# Changer la propriété du fichier au user admin
RUN chown admin:admin app.jar

# Passer à l'utilisateur non-root
USER admin

# Exposer le port de l'application Spring Boot
EXPOSE 8080

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
