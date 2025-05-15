package com.gestion_hospitaliere.UeEntreprise.service.Appointments;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.Appointments.RendezVousRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.MedecinRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.SageFemmeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private SageFemmeRepository sageFemmeRepository;

    public List<RendezVous> getAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    public RendezVous getRendezVousById(Long id) {
        return rendezVousRepository.findById(id).orElse(null);
    }

    public RendezVous createRendezVous(RendezVous rendezVous) {
        // Récupérer et valider le patient
        Long patientId = rendezVous.getPatient().getId();
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));
        rendezVous.setPatient(patient);

        // Récupérer et valider le médecin s'il est fourni
        if (rendezVous.getMedecin() != null) {
            Long medecinId = rendezVous.getMedecin().getId();
            Medecin medecin = medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + medecinId));
            rendezVous.setMedecin(medecin);
        }

        // Récupérer et valider la sage-femme si elle est fournie
        if (rendezVous.getSageFemme() != null) {
            Long sageFemmeId = rendezVous.getSageFemme().getId();
            SageFemme sageFemme = sageFemmeRepository.findById(sageFemmeId)
                .orElseThrow(() -> new RuntimeException("Sage-femme non trouvée avec l'id : " + sageFemmeId));
            rendezVous.setSageFemme(sageFemme);
        }

        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous updateRendezVous(Long id, RendezVous updatedRendezVous) {
        if (!rendezVousRepository.existsById(id)) {
            return null;
        }

        updatedRendezVous.setId(id);

        // Récupérer et valider le patient
        Long patientId = updatedRendezVous.getPatient().getId();
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));
        updatedRendezVous.setPatient(patient);

        // Récupérer et valider le médecin s'il est fourni
        if (updatedRendezVous.getMedecin() != null) {
            Long medecinId = updatedRendezVous.getMedecin().getId();
            Medecin medecin = medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + medecinId));
            updatedRendezVous.setMedecin(medecin);
        }

        // Récupérer et valider la sage-femme si elle est fournie
        if (updatedRendezVous.getSageFemme() != null) {
            Long sageFemmeId = updatedRendezVous.getSageFemme().getId();
            SageFemme sageFemme = sageFemmeRepository.findById(sageFemmeId)
                .orElseThrow(() -> new RuntimeException("Sage-femme non trouvée avec l'id : " + sageFemmeId));
            updatedRendezVous.setSageFemme(sageFemme);
        }

        return rendezVousRepository.save(updatedRendezVous);
    }

    public void deleteRendezVous(Long id) {
        rendezVousRepository.deleteById(id);
    }

    public List<RendezVous> findByStatut(String statut) {
        return rendezVousRepository.findByStatut(statut);
    }

    public List<RendezVous> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return rendezVousRepository.findByDateHeureBetween(startDate, endDate);
    }
}
