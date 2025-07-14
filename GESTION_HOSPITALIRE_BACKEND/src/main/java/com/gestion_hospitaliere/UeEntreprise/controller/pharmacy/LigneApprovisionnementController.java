package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

// import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.LigneApprovisionnementService;

@RestController
@RequestMapping("/api/lignes-approvisionnement")
public class LigneApprovisionnementController {
    private final LigneApprovisionnementService ligneApprovisionnementService;

    public LigneApprovisionnementController(LigneApprovisionnementService ligneApprovisionnementService) {
        this.ligneApprovisionnementService = ligneApprovisionnementService;
    }

    @GetMapping
    public List<LigneApprovisionnement> getAllLignesApprovisionnement() {
        return ligneApprovisionnementService.getAllLignesApprovisionnement();
    }

    @GetMapping("/{id}")
    public LigneApprovisionnement getLigneApprovisionnementById(@PathVariable Long id) {
        return ligneApprovisionnementService.getLigneApprovisionnementById(id);
    }

    @PostMapping
    public ResponseEntity<?> createLigneApprovisionnement(@RequestBody LigneApprovisionnement ligneApprovisionnement) {
        try {
            return ResponseEntity.ok(ligneApprovisionnementService.saveLigneApprovisionnement(ligneApprovisionnement));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public LigneApprovisionnement updateLigneApprovisionnement(@PathVariable Long id, @RequestBody LigneApprovisionnement ligneApprovisionnement) {
        ligneApprovisionnement.setId(id);
        return ligneApprovisionnementService.saveLigneApprovisionnement(ligneApprovisionnement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLigneApprovisionnement(@PathVariable Long id) {
        try {
            ligneApprovisionnementService.deleteLigneApprovisionnement(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @GetMapping("/by-approvisionnement/{approvisionnementId}")
    public List<LigneApprovisionnement> getByApprovisionnementId(@PathVariable Long approvisionnementId) {
        return ligneApprovisionnementService.getByApprovisionnementId(approvisionnementId);
    }

//    @GetMapping("/by-medicament/{medicamentId}")
//    public List<LigneApprovisionnement> getByMedicamentId(@PathVariable Long medicamentId) {
//        return ligneApprovisionnementService.getByMedicamentId(medicamentId);
//    }

    // @GetMapping("/expiration-before")
    // public List<LigneApprovisionnement> getByDateExpirationBefore(@RequestParam LocalDate date) {
    //     return ligneApprovisionnementService.getByDateExpirationBefore(date);
    // }
}