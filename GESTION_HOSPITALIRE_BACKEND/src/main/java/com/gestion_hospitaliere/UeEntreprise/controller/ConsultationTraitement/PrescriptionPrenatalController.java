package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.PrescriptionPrenatal;
import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.PrescriptionPrenatalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions-prenatales")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionPrenatalController {

    @Autowired
    private PrescriptionPrenatalService prescriptionPrenatalService;

    @GetMapping
    public ResponseEntity<List<PrescriptionPrenatal>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionPrenatalService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionPrenatal> getPrescriptionById(@PathVariable Long id) {
        return prescriptionPrenatalService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/consultation-prenatale/{consultationPrenataleId}")
    public ResponseEntity<List<PrescriptionPrenatal>> getByConsultationPrenataleId(@PathVariable Long consultationPrenataleId) {
        List<PrescriptionPrenatal> prescriptions = prescriptionPrenatalService.getByConsultationPrenataleId(consultationPrenataleId);
        return ResponseEntity.ok(prescriptions);
    }

    @PostMapping
    public ResponseEntity<PrescriptionPrenatal> createPrescription(@RequestBody PrescriptionPrenatal prescription) {
        PrescriptionPrenatal created = prescriptionPrenatalService.savePrescription(prescription);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionPrenatal> updatePrescription(@PathVariable Long id, @RequestBody PrescriptionPrenatal prescription) {
        PrescriptionPrenatal updated = prescriptionPrenatalService.updatePrescription(id, prescription);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionPrenatalService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}