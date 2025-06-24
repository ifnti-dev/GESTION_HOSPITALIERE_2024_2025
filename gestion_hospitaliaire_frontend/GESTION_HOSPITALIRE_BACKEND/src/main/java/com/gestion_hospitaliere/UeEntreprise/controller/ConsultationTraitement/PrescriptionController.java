
// package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;

// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
// import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.PrescriptionService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/prescriptions")
   
// public class PrescriptionController {
// @Autowired
//     private final PrescriptionService prescriptionService;

 
//     public PrescriptionController(PrescriptionService prescriptionService) {
//         this.prescriptionService = prescriptionService;
//     }

//     @GetMapping
//     public ResponseEntity<List<Prescription>> getAllPrescriptions() {
//         List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
//         return ResponseEntity.ok(prescriptions);
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
//         Optional<Prescription> prescription = prescriptionService.getPrescriptionById(id);
//         return prescription.map(ResponseEntity::ok)
//                            .orElseGet(() -> ResponseEntity.notFound().build());
//     }

//     @PostMapping
//     public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
//         Prescription savedPrescription = prescriptionService.savePrescription(prescription);
//         return ResponseEntity.status(HttpStatus.CREATED).body(savedPrescription);
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescriptionDetails) {
//         try {
//             Prescription updatedPrescription = prescriptionService.updatePrescription(id, prescriptionDetails);
//             return ResponseEntity.ok(updatedPrescription);
//         } catch (RuntimeException e) {
//             // Gérer l'exception si la prescription n'est pas trouvée
//             return ResponseEntity.notFound().build();
//         }
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
//         try {
//             prescriptionService.deletePrescription(id);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             // Gérer l'exception si la prescription n'est pas trouvée
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Vous pouvez ajouter ici des endpoints pour des méthodes de service personnalisées
//     // Exemple: @GetMapping("/consultation/{consultationId}")
// }

