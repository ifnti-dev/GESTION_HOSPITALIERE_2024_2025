// package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;

// import java.time.LocalDate;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
// import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.ConsultationService;

// @RestController
// @RequestMapping("/api/consultations")
// public class ConsultationController {

//     @Autowired
//     private ConsultationService consultationService;

//     @GetMapping
//     public List<Consultation> getAllConsultations() {
//         return consultationService.getAllConsultations();
//     }

//     @GetMapping("/{id}")
//     public Consultation getConsultationById(@PathVariable Long id) {
//         return consultationService.getConsultationById(id);
//     }

//     @PostMapping
//     public Consultation createConsultation(@RequestBody Consultation consultation) {
//         return consultationService.createConsultation(consultation);
//     }

//     @PutMapping("/{id}")
//     public Consultation updateConsultation(@PathVariable Long id, @RequestBody Consultation consultation) {
//         return consultationService.updateConsultation(id, consultation);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteConsultation(@PathVariable Long id) {
//         consultationService.deleteConsultation(id);
//     }

//     @GetMapping("/date")
//     public List<Consultation> findByDate(@RequestParam LocalDate date) {
//         return consultationService.findByDate(date);
//     }

//     @GetMapping("/patient/{patientId}")
//     public List<Consultation> findByPatientId(@PathVariable Long patientId) {
//         return consultationService.findByPatientId(patientId);
//     }
// }