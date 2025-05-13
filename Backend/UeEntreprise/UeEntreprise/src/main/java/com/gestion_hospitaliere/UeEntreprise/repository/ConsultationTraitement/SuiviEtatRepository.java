package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;

@Repository
public interface SuiviEtatRepository extends JpaRepository<SuiviEtat, Long> {
    
    // Trouver les suivis par patient ID
    List<SuiviEtat> findByPatientId(Long patientId);
    
    // Trouver les suivis par date
    List<SuiviEtat> findByDate(LocalDate date);
    
    // Trouver les suivis par température
    List<SuiviEtat> findByTemperature(Integer temperature);
    
    // Trouver les suivis par tension
    List<SuiviEtat> findByTension(Float tension);
    
    // Trouver les suivis par observations
    List<SuiviEtat> findByObservationsContaining(String observations);
}