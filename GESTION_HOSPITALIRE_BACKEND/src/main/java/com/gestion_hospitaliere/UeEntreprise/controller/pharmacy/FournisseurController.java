package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Fournisseur;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.FournisseurService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    @GetMapping
    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurService.getAllFournisseurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> getFournisseurById(@PathVariable Long id) {
        return ResponseEntity.ok(fournisseurService.getFournisseurById(id));
    }

    @PostMapping
    public Fournisseur createFournisseur(@RequestBody Fournisseur fournisseur) {
        return fournisseurService.createFournisseur(fournisseur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> updateFournisseur(@PathVariable Long id, @RequestBody Fournisseur fournisseurDetails) {
        return ResponseEntity.ok(fournisseurService.updateFournisseur(id, fournisseurDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nom/{nom}")
    public ResponseEntity<Fournisseur> getFournisseurByNom(@PathVariable String nom) {
        return ResponseEntity.ok(fournisseurService.getFournisseurByNom(nom));
    }
}