package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    // Utilisée par ConsultationService.getConsultationsByDate
    List<Consultation> findByDate(LocalDate date);

    // Utilisée par ConsultationService.getConsultationsByPersonneId
    List<Consultation> findByPersonne_Id(Long personneId);

    // Utilisée par ConsultationService.getConsultationsByDiagnosticContaining
    List<Consultation> findByDiagnosticContaining(String keyword);
}