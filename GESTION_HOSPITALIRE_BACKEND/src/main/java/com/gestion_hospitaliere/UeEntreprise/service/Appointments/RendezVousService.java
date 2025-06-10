package com.gestion_hospitaliere.UeEntreprise.service.Appointments;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.Appointments.RendezVousRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private EmployeRepository employeRepository;

    

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
        if (rendezVous.getEmploye() != null) {
            Long employeId = rendezVous.getEmploye().getId();
            Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + employeId));
            rendezVous.setEmploye(employe);
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
        if (updatedRendezVous.getEmploye() != null) {
            Long employeId = updatedRendezVous.getEmploye().getId();
            Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + employeId));
            updatedRendezVous.setEmploye(employe);
        }

        // Récupérer et valider la sage-femme si elle est fournie
       

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
