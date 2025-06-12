package com.gestion_hospitaliere.UeEntreprise.repository.Appointments;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    
    // Trouver les rendez-vous par statut
    List<RendezVous> findByStatut(String statut);
    
    // Trouver les rendez-vous par type
    List<RendezVous> findByType(String type);
    
    // Trouver les rendez-vous par patient ID
    List<RendezVous> findByPersonne_Id(Long patientId);
    
    // Trouver les rendez-vous dans une plage de dates
    List<RendezVous> findByDateHeureBetween(LocalDateTime startDate, LocalDateTime endDate);
}
