package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Reference;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.ReferenceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/references")
public class ReferenceController {

    private final ReferenceService referenceService;

    public ReferenceController(ReferenceService referenceService) {
        this.referenceService = referenceService;
    }

    @GetMapping
    public List<Reference> getAllReferences() {
        return referenceService.getAllReferences();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reference> getReferenceById(@PathVariable Long id) {
        return ResponseEntity.ok(referenceService.getReferenceById(id));
    }

    @PostMapping
    public Reference createReference(@RequestBody Reference reference) {
        return referenceService.createReference(reference);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reference> updateReference(@PathVariable Long id, @RequestBody Reference referenceDetails) {
        return ResponseEntity.ok(referenceService.updateReference(id, referenceDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReference(@PathVariable Long id) {
        referenceService.deleteReference(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medicament/{medicamentId}")
    public List<Reference> getReferencesByMedicament(@PathVariable Long medicamentId) {
        return referenceService.getReferencesByMedicament(medicamentId);
    }

    @GetMapping("/search")
    public List<Reference> searchReferencesByName(@RequestParam String nom) {
        return referenceService.searchReferencesByName(nom);
    }
}
