package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.MedecinRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    public Consultation createConsultation(Consultation consultation) {
        // Récupérer les entités persistées
        Medecin medecin = medecinRepository.findById(consultation.getMedecin().getId())
            .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

        Patient patient = patientRepository.findById(consultation.getPatient().getId())
            .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        // Réassigner les entités persistées à la consultation
        consultation.setMedecin(medecin);
        consultation.setPatient(patient);

        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long id, Consultation updatedConsultation) {
        if (consultationRepository.existsById(id)) {
            Medecin medecin = medecinRepository.findById(updatedConsultation.getMedecin().getId())
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

            Patient patient = patientRepository.findById(updatedConsultation.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

            updatedConsultation.setId(id);
            updatedConsultation.setMedecin(medecin);
            updatedConsultation.setPatient(patient);

            return consultationRepository.save(updatedConsultation);
        }
        return null;
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    public List<Consultation> findByDate(LocalDate date) {
        return consultationRepository.findByDate(date);
    }

    public List<Consultation> findByPatientId(Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
}
