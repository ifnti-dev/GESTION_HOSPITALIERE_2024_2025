package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription updatedPrescription) {
        if (prescriptionRepository.existsById(id)) {
            updatedPrescription.setId(id);
            return prescriptionRepository.save(updatedPrescription);
        }
        return null;
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    public List<Prescription> findByConsultationId(Long consultationId) {
        return prescriptionRepository.findByConsultationId(consultationId);
    }

    public List<Prescription> findByMedicamentId(Long medicamentId) {
        return prescriptionRepository.findByMedicamentId(medicamentId);
    }

    public List<Prescription> findByPosologieContaining(String posologie) {
        return prescriptionRepository.findByPosologieContaining(posologie);
    }
}