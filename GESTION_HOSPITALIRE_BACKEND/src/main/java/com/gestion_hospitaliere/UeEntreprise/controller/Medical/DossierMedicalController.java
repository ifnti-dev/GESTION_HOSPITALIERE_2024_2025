package com.gestion_hospitaliere.UeEntreprise.controller.Medical;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.service.Medical.DossierMedicalService;

@RestController
@RequestMapping("/api/dossiers-medical")
@CrossOrigin // utile si tu appelles cette API depuis une appli web frontend
public class DossierMedicalController {

    @Autowired
    private DossierMedicalService dossierMedicalService;

    @GetMapping
    public List<DossierMedical> getAllDossiers() {
        return dossierMedicalService.getAllDossiers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierMedical> getDossierById(@PathVariable Long id) {
        return dossierMedicalService.getDossierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/groupe-sanguin")
    public ResponseEntity<DossierMedical> getDossierByGroupeSanguin(@RequestParam String groupeSanguin) {
        return dossierMedicalService.getDossierByGroupeSanguin(groupeSanguin)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/patient/{patientId}")
    public ResponseEntity<DossierMedical> getDossierByPatientId(@PathVariable Long patientId) {
        return dossierMedicalService.getDossierByPatientId(patientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DossierMedical> createDossier(@RequestBody DossierMedical dossierMedical) {
        DossierMedical saved = dossierMedicalService.saveDossier(dossierMedical);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DossierMedical> updateDossier(@PathVariable Long id,
            @RequestBody DossierMedical dossierDetails) {
        try {
            DossierMedical updated = dossierMedicalService.updateDossier(id, dossierDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDossier(@PathVariable Long id) {
        if (dossierMedicalService.getDossierById(id).isPresent()) {
            dossierMedicalService.deleteDossier(id);
            return ResponseEntity.ok("✅ Dossier médical supprimé avec succès.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Dossier non trouvé.");
        }
    }

}
