package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;
import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.ConsultationPrenataleService;

import java.util.List;

@RestController
@RequestMapping("/api/consultations-prenatales")
@CrossOrigin(origins = "http://localhost:3000") // Adaptez si votre frontend tourne sur un autre port
public class ConsultationPrenataleController {

    @Autowired
    private ConsultationPrenataleService consultationService;

    @GetMapping
    public ResponseEntity<List<ConsultationPrenatale>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationPrenatale> getConsultationById(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @GetMapping("/dossier-grossesse/{dossierGrossesseId}")
public ResponseEntity<List<ConsultationPrenatale>> getConsultationsByDossierGrossesseId(@PathVariable Long dossierGrossesseId) {
    List<ConsultationPrenatale> consultations = consultationService.getConsultationsByDossierGrossesseId(dossierGrossesseId);
    return ResponseEntity.ok(consultations);
}

    @PostMapping
    public ResponseEntity<ConsultationPrenatale> createConsultation(@RequestBody ConsultationPrenatale dto) {
        ConsultationPrenatale createdDto = consultationService.createConsultation(dto);
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultationPrenatale> updateConsultation(@PathVariable Long id, @RequestBody ConsultationPrenatale dto) {
        ConsultationPrenatale updatedDto = consultationService.updateConsultation(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }
}

