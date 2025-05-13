package com.gestion_hospitaliere.UeEntreprise.service.consultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.repository.consultationTraitement.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public Prescription savePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription prescriptionDetails) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription non trouvée avec l'id : " + id));

        // Mettre à jour les champs de prescription. Exemple :
        // prescription.setMedicament(prescriptionDetails.getMedicament());
        // prescription.setDosage(prescriptionDetails.getDosage());
        // ...

        prescriptionDetails.setId(id); // Assurez-vous que l'ID est correct
        return prescriptionRepository.save(prescriptionDetails);
    }

    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription non trouvée avec l'id : " + id + " pour la suppression.");
        }
        prescriptionRepository.deleteById(id);
    }

    // Vous pouvez ajouter ici des méthodes spécifiques basées sur votre repository, par exemple :
    // public List<Prescription> findPrescriptionsByConsultationId(Long consultationId) { ... }
}