package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    
    // Trouver les consultations par date
    List<Consultation> findByDate(LocalDate date);
    
    // Trouver les consultations par patient ID
    List<Consultation> findByPatientId(Long patientId);
    
    // Trouver les consultations par médecin ID
    List<Consultation> findByMedecinId(Long medecinId);
    
    // Trouver les consultations par diagnostic
    List<Consultation> findByDiagnosticContaining(String diagnostic);
}