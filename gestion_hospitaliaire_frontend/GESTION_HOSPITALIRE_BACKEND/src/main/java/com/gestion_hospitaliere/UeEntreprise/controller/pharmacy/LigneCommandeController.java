package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.LigneCommandeService;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;

@RestController
@RequestMapping("/api/lignes-commande")
public class LigneCommandeController {
    private final LigneCommandeService ligneCommandeService;

    public LigneCommandeController(LigneCommandeService ligneCommandeService) {
        this.ligneCommandeService = ligneCommandeService;
    }

    @GetMapping
    public List<LigneCommande> getAllLignesCommande() {
        return ligneCommandeService.getAllLignesCommande();
    }

    @GetMapping("/{id}")
    public LigneCommande getLigneCommandeById(@PathVariable Long id) {
        return ligneCommandeService.getLigneCommandeById(id);
    }

    @PostMapping
    public LigneCommande createLigneCommande(@RequestBody LigneCommande ligneCommande) {
        return ligneCommandeService.saveLigneCommande(ligneCommande);
    }

    @PutMapping("/{id}")
    public LigneCommande updateLigneCommande(@PathVariable Long id, @RequestBody LigneCommande ligneCommande) {
        ligneCommande.setId(id);
        return ligneCommandeService.saveLigneCommande(ligneCommande);
    }

    @DeleteMapping("/{id}")
    public void deleteLigneCommande(@PathVariable Long id) {
        ligneCommandeService.deleteLigneCommande(id);
    }

    @GetMapping("/by-commande/{commandeId}")
    public List<LigneCommande> getByCommandeId(@PathVariable Long commandeId) {
        return ligneCommandeService.getByCommandeId(commandeId);
    }

    @GetMapping("/by-medicament/{medicamentId}")
    public List<LigneCommande> getByMedicamentId(@PathVariable Long medicamentId) {
        return ligneCommandeService.getByMedicamentId(medicamentId);
    }

    @GetMapping("/by-prix")
    public List<LigneCommande> getByPrixUnitaireGreaterThan(@RequestParam Integer prix) {
        return ligneCommandeService.getByPrixUnitaireGreaterThan(prix);
    }
}
