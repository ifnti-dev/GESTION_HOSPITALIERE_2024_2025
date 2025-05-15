package com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;

import java.util.List;

@Repository
public interface AccouchementRepository extends JpaRepository<Accouchement, Long> {
    List<Accouchement> findByDossierGrossesseId(Long dossierId);
    List<Accouchement> findBySageFemmeId(Long sageFemmeId);
}