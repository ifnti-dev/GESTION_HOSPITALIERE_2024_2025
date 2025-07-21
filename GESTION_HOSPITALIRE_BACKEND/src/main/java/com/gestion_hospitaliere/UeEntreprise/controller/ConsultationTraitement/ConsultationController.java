package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;


import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.ConsultationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private  ConsultationService consultationService;
  
    // Récupérer toutes les consultations
    @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        List<Consultation> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(consultations);
    }

    // Récupérer une consultation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Optional<Consultation> consultation = consultationService.getConsultationById(id);
        return consultation.map(ResponseEntity::ok)
                           .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // // Créer une nouvelle consultation
//    @PostMapping
// public ResponseEntity<?> createConsultation(@RequestBody Consultation consultation) {
//     try {
//         Consultation savedConsultation = consultationService.saveConsultation(consultation);
//         return ResponseEntity.status(HttpStatus.CREATED).body(savedConsultation);
//     } catch (IllegalArgumentException e) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 avec message lisible
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + e.getMessage());
//     }
// }



//     // Mettre à jour une consultation existante
//     @PutMapping("/{id}")
//     public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @RequestBody Consultation consultationDetails) {
//         try {
//             Consultation updatedConsultation = consultationService.updateConsultation(id, consultationDetails);
//             return ResponseEntity.ok(updatedConsultation);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

    // Supprimer une consultation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        try {
            consultationService.deleteConsultation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Récupérer les consultations par date
    @GetMapping("/by-date")
    public ResponseEntity<List<Consultation>> getConsultationsByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Consultation> consultations = consultationService.getConsultationsByDate(date);
        return ResponseEntity.ok(consultations);
    }

    // Récupérer les consultations par ID de personne (patient)
    // Note: "Personne" est utilisé ici en se basant sur la méthode findByPersonne_Id du repository.
    @GetMapping("/by-personne/{dossierMedicalId}")
    public ResponseEntity<List<Consultation>> getConsultationsByPersonneId(@PathVariable Long dossierMedicalId) {
        List<Consultation> consultations = consultationService.getConsultationsByDossierMedicalId(dossierMedicalId);
        return ResponseEntity.ok(consultations);
    }

    // Récupérer les consultations par mot-clé dans le diagnostic
    @GetMapping("/by-diagnostic")
    public ResponseEntity<List<Consultation>> getConsultationsByDiagnostic(@RequestParam String keyword) {
        List<Consultation> consultations = consultationService.getConsultationsByDiagnosticContaining(keyword);
        return ResponseEntity.ok(consultations);
    }


}
