package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.PrescriptionPrenatal;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.PrescriptionPrenatal.TypePrescription;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.PrescriptionPrenatalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionPrenatalService {

    private final PrescriptionPrenatalRepository prescriptionPrenatalRepository;

    @Autowired
    public PrescriptionPrenatalService(PrescriptionPrenatalRepository prescriptionPrenatalRepository) {
        this.prescriptionPrenatalRepository = prescriptionPrenatalRepository;
    }

    public List<PrescriptionPrenatal> getAllPrescriptions() {
        return prescriptionPrenatalRepository.findAll();
    }

    public Optional<PrescriptionPrenatal> getPrescriptionById(Long id) {
        return prescriptionPrenatalRepository.findById(id);
    }

    public PrescriptionPrenatal savePrescription(PrescriptionPrenatal prescription) {

        if (prescription.getType() == null) {
            throw new IllegalArgumentException("Le type de prescription (MEDICAMENT ou EXAMEN) est requis.");
        }

        // Vérifie qu'une consultation prénatale est liée
        if (prescription.getConsultationPrenatale() == null || prescription.getConsultationPrenatale().getId() == null) {
            throw new IllegalArgumentException("La prescription doit être liée à une consultation prénatale (via son ID).");
        }

        // Vérification pour un médicament
        if (prescription.getType() == TypePrescription.MEDICAMENT) {
            if (prescription.getPosologie() == null || prescription.getDureeJours() == null || prescription.getQuantiteParJour() == null) {
                throw new IllegalArgumentException("Pour un médicament, posologie, durée et quantité par jour sont obligatoires.");
            }
        }

        // Vérification pour un examen
        if (prescription.getType() == TypePrescription.EXAMEN) {
            if (prescription.getDatePrevue() == null || prescription.getLieuRealisation() == null) {
                throw new IllegalArgumentException("Pour un examen, la date prévue et le lieu de réalisation sont obligatoires.");
            }
        }

        return prescriptionPrenatalRepository.save(prescription);
    }

    public PrescriptionPrenatal updatePrescription(Long id, PrescriptionPrenatal updated) {
        PrescriptionPrenatal prescription = prescriptionPrenatalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription non trouvée avec l'ID : " + id));

        // Mise à jour des champs communs
        if (updated.getType() != null) {
            prescription.setType(updated.getType());
        }

        prescription.setDesignation(updated.getDesignation());
        prescription.setInstructions(updated.getInstructions());
        prescription.setCommentaire(updated.getCommentaire());
        prescription.setDateDebut(updated.getDateDebut());
        prescription.setDateFin(updated.getDateFin());

        // Champs médicament
        prescription.setPosologie(updated.getPosologie());
        prescription.setQuantiteParJour(updated.getQuantiteParJour());
        prescription.setDureeJours(updated.getDureeJours());

        // Champs examen
        prescription.setDatePrevue(updated.getDatePrevue());
        prescription.setLieuRealisation(updated.getLieuRealisation());

        // Mise à jour de la consultation prénatale (via ID de l'objet)
        if (updated.getConsultationPrenatale() != null && updated.getConsultationPrenatale().getId() != null) {
            prescription.setConsultationPrenatale(updated.getConsultationPrenatale());
        }

        return prescriptionPrenatalRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        if (!prescriptionPrenatalRepository.existsById(id)) {
            throw new RuntimeException("Prescription non trouvée avec l'ID : " + id);
        }
        prescriptionPrenatalRepository.deleteById(id);
    }

    public List<PrescriptionPrenatal> getByConsultationPrenataleId(Long consultationPrenataleId) {
        return prescriptionPrenatalRepository.findByConsultationPrenatale_Id(consultationPrenataleId);
    }
}
