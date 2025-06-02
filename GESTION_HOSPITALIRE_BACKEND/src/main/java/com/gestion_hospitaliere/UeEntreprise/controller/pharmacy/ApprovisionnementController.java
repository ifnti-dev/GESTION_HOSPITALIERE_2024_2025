package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Approvisionnement;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.ApprovisionnementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvisionnements")
public class ApprovisionnementController {

    private final ApprovisionnementService approvisionnementService;

    public ApprovisionnementController(ApprovisionnementService approvisionnementService) {
        this.approvisionnementService = approvisionnementService;
    }

    @GetMapping
    public List<Approvisionnement> getAllApprovisionnements() {
        return approvisionnementService.getAllApprovisionnements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Approvisionnement> getApprovisionnementById(@PathVariable Long id) {
        return ResponseEntity.ok(approvisionnementService.getApprovisionnementById(id));
    }

    @PostMapping
    public Approvisionnement createApprovisionnement(@RequestBody Approvisionnement approvisionnement) {
        return approvisionnementService.createApprovisionnement(approvisionnement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Approvisionnement> updateApprovisionnement(@PathVariable Long id, @RequestBody Approvisionnement approvisionnementDetails) {
        return ResponseEntity.ok(approvisionnementService.updateApprovisionnement(id, approvisionnementDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApprovisionnement(@PathVariable Long id) {
        approvisionnementService.deleteApprovisionnement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fournisseur/{fournisseurId}")
    public List<Approvisionnement> getApprovisionnementsByFournisseur(@PathVariable Long fournisseurId) {
        return approvisionnementService.getApprovisionnementsByFournisseur(fournisseurId);
    }
}