package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.LigneCommandeService;

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
    public ResponseEntity<LigneCommande> getLigneCommandeById(@PathVariable Long id) {
        try {
            LigneCommande ligneCommande = ligneCommandeService.getLigneCommandeById(id);
            return ResponseEntity.ok(ligneCommande);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createLigneCommande(@RequestBody LigneCommande ligneCommande) {
        try {
            LigneCommande savedLigne = ligneCommandeService.saveLigneCommande(ligneCommande);
            return ResponseEntity.ok(savedLigne);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLigneCommande(@PathVariable Long id, @RequestBody LigneCommande ligneCommande) {
        try {
            ligneCommande.setId(id);
            LigneCommande updatedLigne = ligneCommandeService.saveLigneCommande(ligneCommande);
            return ResponseEntity.ok(updatedLigne);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLigneCommande(@PathVariable Long id) {
        try {
            ligneCommandeService.deleteLigneCommande(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @GetMapping("/by-commande/{commandeId}")
    public List<LigneCommande> getByCommandeId(@PathVariable Long commandeId) {
        return ligneCommandeService.getByCommandeId(commandeId);
    }

    @GetMapping("/by-ligne-approvisionnement/{ligneApprovisionnementId}")
    public List<LigneCommande> getByLigneApprovisionnementId(@PathVariable Long ligneApprovisionnementId) {
        return ligneCommandeService.getByLigneApprovisionnementId(ligneApprovisionnementId);
    }

    // Endpoints pour la gestion des lots (FIFO)
    @GetMapping("/lots-disponibles")
    public List<LigneApprovisionnement> getAllAvailableLots() {
        return ligneCommandeService.getAllAvailableLots();
    }

    @GetMapping("/lots-disponibles/medicament/{medicamentReferenceId}")
    public List<LigneApprovisionnement> getAvailableLotsByMedicamentReference(@PathVariable Long medicamentReferenceId) {
        return ligneCommandeService.getAvailableLotsByMedicamentReference(medicamentReferenceId);
    }

    @GetMapping("/lots-expirants")
    public List<LigneApprovisionnement> getExpiringSoonLots(@RequestParam(defaultValue = "30") int daysAhead) {
        return ligneCommandeService.getExpiringSoonLots(daysAhead);
    }

    @GetMapping("/lots-expires")
    public List<LigneApprovisionnement> getExpiredLots() {
        return ligneCommandeService.getExpiredLots();
    }

    @GetMapping("/lots-stock-faible")
    public List<LigneApprovisionnement> getLowStockLots(@RequestParam(defaultValue = "10") Integer seuilMinimum) {
        return ligneCommandeService.getLowStockLots(seuilMinimum);
    }

    // Endpoint pour créer une ligne de commande FIFO automatique
    @PostMapping("/fifo")
    public ResponseEntity<?> createLigneCommandeFIFO(
            @RequestParam Long commandeId,
            @RequestParam Long medicamentReferenceId,
            @RequestParam Integer quantite) {
        try {
            LigneCommande ligneCommande = ligneCommandeService.createLigneCommandeFIFO(
                commandeId, medicamentReferenceId, quantite);
            return ResponseEntity.ok(ligneCommande);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur FIFO: " + e.getMessage());
        }
    }
}
