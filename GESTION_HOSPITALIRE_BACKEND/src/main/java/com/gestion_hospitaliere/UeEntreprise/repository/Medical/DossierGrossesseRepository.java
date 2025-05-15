package com.gestion_hospitaliere.UeEntreprise.repository.Medical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;

import java.util.Optional;

@Repository
public interface DossierGrossesseRepository extends JpaRepository<DossierGrossesse, Long> {
    Optional<DossierGrossesse> findByPatientId(Long patientId);
}