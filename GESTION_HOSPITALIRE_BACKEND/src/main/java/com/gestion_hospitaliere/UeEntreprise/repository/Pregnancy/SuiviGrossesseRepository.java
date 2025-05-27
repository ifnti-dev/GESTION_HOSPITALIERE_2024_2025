package com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;

import java.util.List;

@Repository
public interface SuiviGrossesseRepository extends JpaRepository<SuiviGrossesse, Long> {
    List<SuiviGrossesse> findByDossierGrossesseId(Long dossierId);
}