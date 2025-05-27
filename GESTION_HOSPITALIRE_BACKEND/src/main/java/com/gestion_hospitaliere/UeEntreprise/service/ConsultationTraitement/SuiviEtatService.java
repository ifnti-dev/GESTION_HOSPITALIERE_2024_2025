package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.SuiviEtatRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class SuiviEtatService {

    @Autowired
    private SuiviEtatRepository suiviEtatRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<SuiviEtat> getAllSuiviEtats() {
        return suiviEtatRepository.findAll();
    }

    public SuiviEtat getSuiviEtatById(Long id) {
        return suiviEtatRepository.findById(id).orElse(null);
    }

    public SuiviEtat createSuiviEtat(SuiviEtat suiviEtat) {
        // Récupération et vérification du patient
        Long patientId = suiviEtat.getPatient().getId();
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));
        
        // Association explicite du patient récupéré
        suiviEtat.setPatient(patient);

        return suiviEtatRepository.save(suiviEtat);
    }

    public SuiviEtat updateSuiviEtat(Long id, SuiviEtat updatedSuiviEtat) {
        if (suiviEtatRepository.existsById(id)) {
            Long patientId = updatedSuiviEtat.getPatient().getId();
            Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));
            
            updatedSuiviEtat.setId(id);
            updatedSuiviEtat.setPatient(patient);

            return suiviEtatRepository.save(updatedSuiviEtat);
        }
        return null;
    }

    public void deleteSuiviEtat(Long id) {
        suiviEtatRepository.deleteById(id);
    }

    public List<SuiviEtat> findByPatientId(Long patientId) {
        return suiviEtatRepository.findByPatientId(patientId);
    }

    public List<SuiviEtat> findByDate(LocalDate date) {
        return suiviEtatRepository.findByDate(date);
    }

    public List<SuiviEtat> findByTemperature(Integer temperature) {
        return suiviEtatRepository.findByTemperature(temperature);
    }

    public List<SuiviEtat> findByTension(Float tension) {
        return suiviEtatRepository.findByTension(tension);
    }

    public List<SuiviEtat> findByObservationsContaining(String observations) {
        return suiviEtatRepository.findByObservationsContaining(observations);
    }
}
