package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.LigneApprovisionnementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes-approvisionnement")
public class LigneApprovisionnementController {

    private final LigneApprovisionnementService ligneService;

    public LigneApprovisionnementController(LigneApprovisionnementService ligneService) {
        this.ligneService = ligneService;
    }

    @GetMapping
    public List<LigneApprovisionnement> getAllLignes() {
        return ligneService.getAllLignes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigneApprovisionnement> getLigneById(@PathVariable Long id) {
        return ResponseEntity.ok(ligneService.getLigneById(id));
    }

    @PostMapping
    public LigneApprovisionnement createLigne(@RequestBody LigneApprovisionnement ligne) {
        return ligneService.createLigne(ligne);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LigneApprovisionnement> updateLigne(@PathVariable Long id, @RequestBody LigneApprovisionnement ligneDetails) {
        return ResponseEntity.ok(ligneService.updateLigne(id, ligneDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigne(@PathVariable Long id) {
        ligneService.deleteLigne(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/approvisionnement/{approvisionnementId}")
    public List<LigneApprovisionnement> getLignesByApprovisionnement(@PathVariable Long approvisionnementId) {
        return ligneService.getLignesByApprovisionnement(approvisionnementId);
    }

    @GetMapping("/medicament/{medicamentId}")
    public List<LigneApprovisionnement> getLignesByMedicament(@PathVariable Long medicamentId) {
        return ligneService.getLignesByMedicament(medicamentId);
    }
}
