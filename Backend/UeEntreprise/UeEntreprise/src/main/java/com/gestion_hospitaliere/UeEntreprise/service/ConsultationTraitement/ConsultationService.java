package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    public Consultation createConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long id, Consultation updatedConsultation) {
        if (consultationRepository.existsById(id)) {
            updatedConsultation.setId(id);
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