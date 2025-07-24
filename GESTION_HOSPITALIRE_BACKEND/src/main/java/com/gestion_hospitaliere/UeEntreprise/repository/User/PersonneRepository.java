package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;


@Repository
public interface PersonneRepository extends JpaRepository<Personne, Long> {
    // Méthode pour trouver un utilisateur par son adresse e-mail
    boolean existsByEmail(String email);
    Optional<Personne> findByEmail(String email);

    // Trouver une personne pas email qui est un employé
    @Query("SELECT p FROM Personne p LEFT JOIN FETCH p.employe WHERE p.email = :email")
    Optional<Personne> findByEmailWithEmploye(@Param("email") String email);

    // Trouver la liste des patients (Personnes sans Employé)
    @Query("SELECT p FROM Personne p WHERE p.employe IS NULL")
    List<Personne> findAllPatients();

    // Trouver une personne par son numéro de téléphone
    boolean existsByTelephone(String telephone);
    Optional<Personne> findByTelephone(String telephone);

    // Trouver les pateint sans dossier médical
    @Query("SELECT p FROM Personne p WHERE p.dossierMedical IS NULL")
    List<Personne> findPersonnesSansDossierMedical();


    // Pour éviter la confusion entre "f" et "F"
    @Query("SELECT p FROM Personne p WHERE LOWER(p.sexe) = LOWER(:sexe)")
    List<Personne> findBySexeIgnoreCase(@Param("sexe") String sexe);


    // Trouver Les patient
    List<Personne> findByEmployeIsNull();

    // Trouver les employés
    List<Personne> findByEmployeIsNotNull();
}
