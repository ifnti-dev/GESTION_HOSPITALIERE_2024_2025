// package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
// import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.PrescriptionService;

// @RestController
// @RequestMapping("/api/prescriptions")
// public class PrescriptionController {

//     @Autowired
//     private PrescriptionService prescriptionService;

//     @GetMapping
//     public List<Prescription> getAllPrescriptions() {
//         return prescriptionService.getAllPrescriptions();
//     }

//     @GetMapping("/{id}")
//     public Prescription getPrescriptionById(@PathVariable Long id) {
//         return prescriptionService.getPrescriptionById(id);
//     }

//     @PostMapping
//     public Prescription createPrescription(@RequestBody Prescription prescription) {
//         return prescriptionService.createPrescription(prescription);
//     }

//     @PutMapping("/{id}")
//     public Prescription updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
//         return prescriptionService.updatePrescription(id, prescription);
//     }

//     @DeleteMapping("/{id}")
//     public void deletePrescription(@PathVariable Long id) {
//         prescriptionService.deletePrescription(id);
//     }

//     @GetMapping("/consultation/{consultationId}")
//     public List<Prescription> findByConsultationId(@PathVariable Long consultationId) {
//         return prescriptionService.findByConsultationId(consultationId);
//     }

//     @GetMapping("/medicament/{medicamentId}")
//     public List<Prescription> findByMedicamentId(@PathVariable Long medicamentId) {
//         return prescriptionService.findByMedicamentId(medicamentId);
//     }

//     @GetMapping("/posologie")
//     public List<Prescription> findByPosologieContaining(@RequestParam String posologie) {
//         return prescriptionService.findByPosologieContaining(posologie);
//     }
// }