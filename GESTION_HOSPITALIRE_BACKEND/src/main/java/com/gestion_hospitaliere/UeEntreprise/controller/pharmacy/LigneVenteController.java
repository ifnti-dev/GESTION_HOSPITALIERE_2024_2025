package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.LigneVente;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.LigneVenteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes-vente")
public class LigneVenteController {

    private final LigneVenteService ligneVenteService;

    public LigneVenteController(LigneVenteService ligneVenteService) {
        this.ligneVenteService = ligneVenteService;
    }

    @GetMapping
    public List<LigneVente> getAllLignesVente() {
        return ligneVenteService.getAllLignesVente();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigneVente> getLigneVenteById(@PathVariable Long id) {
        return ResponseEntity.ok(ligneVenteService.getLigneVenteById(id));
    }

    @PostMapping
    public LigneVente createLigneVente(@RequestBody LigneVente ligneVente) {
        return ligneVenteService.createLigneVente(ligneVente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LigneVente> updateLigneVente(@PathVariable Long id, @RequestBody LigneVente ligneVenteDetails) {
        return ResponseEntity.ok(ligneVenteService.updateLigneVente(id, ligneVenteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigneVente(@PathVariable Long id) {
        ligneVenteService.deleteLigneVente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vente/{venteId}")
    public List<LigneVente> getLignesByVente(@PathVariable Long venteId) {
        return ligneVenteService.getLignesByVente(venteId);
    }

    @GetMapping("/medicament/{medicamentId}")
    public List<LigneVente> getLignesByMedicament(@PathVariable Long medicamentId) {
        return ligneVenteService.getLignesByMedicament(medicamentId);
    }
}