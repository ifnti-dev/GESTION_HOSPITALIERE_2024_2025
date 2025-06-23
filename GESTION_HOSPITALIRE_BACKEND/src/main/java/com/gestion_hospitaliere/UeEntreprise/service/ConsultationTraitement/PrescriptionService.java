
package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private final PrescriptionRepository prescriptionRepository;

    
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
        if (prescription.getConsultation() == null || prescription.getConsultation().getId() == null) {
            throw new IllegalArgumentException("Une prescription doit être liée à une consultation.");
        }

        if (prescription.getMedicament() == null || prescription.getMedicament().getId() == null) {
            throw new IllegalArgumentException("Un médicament est requis pour une prescription.");
        }

        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription details) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription non trouvée avec l'id : " + id));

        prescription.setQuantite(details.getQuantite());
        prescription.setDuree(details.getDuree());
        prescription.setPosologie(details.getPosologie());

        if (details.getMedicament() != null) {
            prescription.setMedicament(details.getMedicament());
        }

        if (details.getConsultation() != null) {
            prescription.setConsultation(details.getConsultation());
        }

        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription non trouvée avec l'id : " + id);
        }
        prescriptionRepository.deleteById(id);
    }

  // Liste des prescriptions liées à une consultation
// @GetMapping("/consultation/{consultationId}")
// public ResponseEntity<List<Prescription>> getByConsultationId(@PathVariable Long consultationId) {
//     List<Prescription> prescriptions = PrescriptionService.getPrescriptionsByConsultationId(consultationId);
//     return ResponseEntity.ok(prescriptions);
// }

}
