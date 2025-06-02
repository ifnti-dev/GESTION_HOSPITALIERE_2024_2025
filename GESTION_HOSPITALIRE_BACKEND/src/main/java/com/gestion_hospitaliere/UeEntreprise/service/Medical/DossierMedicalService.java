package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierMedicalRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

import jakarta.transaction.Transactional;

@Service
public class DossierMedicalService {

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<DossierMedical> getAllDossiers() {
        return dossierMedicalRepository.findAll();
    }

    public Optional<DossierMedical> getDossierById(Long id) {
        return dossierMedicalRepository.findById(id);
    }

    public Optional<DossierMedical> getDossierByGroupeSanguin(String groupeSanguin) {
        return dossierMedicalRepository.findByGroupeSanguin(groupeSanguin);
    }

    public Optional<DossierMedical> getDossierByPatientId(Long patientId) {
        return dossierMedicalRepository.findByPatientId(patientId);
    }

    public DossierMedical saveDossier(DossierMedical dossierMedical) {
        Long patientId = dossierMedical.getPatient().getId();

        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));

        dossierMedical.setPatient(patient);

        return dossierMedicalRepository.save(dossierMedical);
    }

@Transactional
public void deleteDossier(Long id) {
    DossierMedical dossier = dossierMedicalRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Dossier non trouvé"));

    // Détacher le dossier du Patient (côté propriétaire ET inverse)
    Patient patient = dossier.getPatient();
    if (patient != null) {
        patient.setDossierMedical(null); // Côté inverse (Patient)
        dossier.setPatient(null); // Côté propriétaire (DossierMedical)
    }

   

    dossierMedicalRepository.delete(dossier); // Suppression unique
}
    



    public DossierMedical updateDossier(Long id, DossierMedical updatedDossier) {
        if (!dossierMedicalRepository.existsById(id)) {
            throw new RuntimeException("Dossier médical non trouvé avec l'id : " + id);
        }
    
        Long patientId = updatedDossier.getPatient().getId();
    
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));
    
        updatedDossier.setId(id);
        updatedDossier.setPatient(patient);
    
        return dossierMedicalRepository.save(updatedDossier);
    }
    
}
