package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.RapportInventaire;
@Repository
public interface RapportInventaireRepository extends JpaRepository<RapportInventaire, Long> {
    List<RapportInventaire> findByEmployeId(Long employeId);
    List<RapportInventaire> findByDateRapport(String date);
    List<RapportInventaire> findByContenuContaining(String keyword);
}