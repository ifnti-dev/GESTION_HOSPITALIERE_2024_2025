package com.gestion_hospitaliere.UeEntreprise.repository.Medical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;

import java.util.Optional;

@Repository
public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    // Recherche par groupe sanguin
    Optional<DossierMedical> findByGroupeSanguin(String groupeSanguin);

    // Recherche par patient ID
    Optional<DossierMedical> findByPersonneId(Long personneId);
}