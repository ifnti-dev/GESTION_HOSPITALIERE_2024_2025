
package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.MedicamentReferenceService;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.MedicamentReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicament-references")
public class MedicamentReferenceController {

    private final MedicamentReferenceService medicamentReferenceService;

    public MedicamentReferenceController(MedicamentReferenceService medicamentReferenceService) {
        this.medicamentReferenceService = medicamentReferenceService;
    }

    @PostMapping
    public MedicamentReference createMedicamentReference(@RequestBody MedicamentReference medicamentReference) {
        return medicamentReferenceService.createMedicamentReference(medicamentReference);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicamentReference> updateMedicamentReference(
            @PathVariable Long id, 
            @RequestBody MedicamentReference medicamentReferenceDetails) {
        return ResponseEntity.ok(medicamentReferenceService.updateMedicamentReference(id, medicamentReferenceDetails));
    }

    @GetMapping
    public List<MedicamentReference> getAllMedicamentReferences() {
        return medicamentReferenceService.getAllMedicamentReferences();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentReference> getMedicamentReferenceById(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentReferenceService.getMedicamentReferenceById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicamentReference(@PathVariable Long id) {
        medicamentReferenceService.deleteMedicamentReference(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medicament/{medicamentId}")
    public List<MedicamentReference> getByMedicamentId(@PathVariable Long medicamentId) {
        return medicamentReferenceService.getByMedicamentId(medicamentId);
    }

    @GetMapping("/reference/{referenceId}")
    public List<MedicamentReference> getByReferenceId(@PathVariable Long referenceId) {
        return medicamentReferenceService.getByReferenceId(referenceId);
    }
}
