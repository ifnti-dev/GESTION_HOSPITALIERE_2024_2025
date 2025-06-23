package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;


@Repository
public interface PersonneRepository extends JpaRepository<Personne, Long> {
    // Méthode pour trouver un utilisateur par son adresse e-mail
   Optional<Personne> findByEmail(String email);

}
