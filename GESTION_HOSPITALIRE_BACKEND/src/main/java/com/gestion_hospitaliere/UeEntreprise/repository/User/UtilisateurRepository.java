package com.gestion_hospitaliere.UeEntreprise.repository.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;


@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    // Méthode pour trouver un utilisateur par son adresse e-mail
    Utilisateur findByEmail(String email);
}
