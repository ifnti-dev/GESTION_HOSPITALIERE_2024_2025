package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public List<Patient> getPatientsByNom(String nom) {
        return patientRepository.findByNom(nom);
    }

    public List<Patient> getPatientsByPrenom(String prenom) {
        return patientRepository.findByPrenom(prenom);
    }

    public List<Patient> getPatientsByNomAndPrenom(String nom, String prenom) {
        return patientRepository.findByNomAndPrenom(nom, prenom);
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
    public Patient updatePatient(Long id, Patient updatedPatient) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient non trouvé avec l'id : " + id);
        }
    
        updatedPatient.setId(id);
        return patientRepository.save(updatedPatient);
    }
    
}