package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;

@Repository
public interface ConsultationPrenataleRepository extends JpaRepository<ConsultationPrenatale, Long> {
    List<ConsultationPrenatale> findByDateConsultation(LocalDate date);


List<ConsultationPrenatale> findByDossierGrossesse_Id(Long dossierGrossesseId);
}
