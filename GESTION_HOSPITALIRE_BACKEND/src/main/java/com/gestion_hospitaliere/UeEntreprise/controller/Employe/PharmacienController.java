package com.gestion_hospitaliere.UeEntreprise.controller.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Pharmacien;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.PharmacienService;

@RestController
@RequestMapping("/api/pharmaciens")
public class PharmacienController {

    @Autowired
    private PharmacienService pharmacienService;

    // Ajouter un pharmacien
    @PostMapping
    public ResponseEntity<Pharmacien> ajouterPharmacien(@RequestBody Pharmacien pharmacien) {
        Pharmacien nouveauPharmacien = pharmacienService.ajouterPharmacien(pharmacien);
        return ResponseEntity.ok(nouveauPharmacien);
    }

    // Récupérer tous les pharmaciens
    @GetMapping
    public ResponseEntity<List<Pharmacien>> obtenirTousLesPharmaciens() {
        List<Pharmacien> pharmaciens = pharmacienService.obtenirTousLesPharmaciens();
        return ResponseEntity.ok(pharmaciens);
    }

    // Récupérer un pharmacien par ID
    @GetMapping("/{id}")
    public ResponseEntity<Pharmacien> obtenirPharmacienParId(@PathVariable Long id) {
        Optional<Pharmacien> pharmacien = pharmacienService.obtenirPharmacienParId(id);
        return pharmacien.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Mettre à jour un pharmacien
    @PutMapping("/{id}")
    public ResponseEntity<Pharmacien> mettreAJourPharmacien(@PathVariable Long id, @RequestBody Pharmacien pharmacienDetails) {
        try {
            Pharmacien pharmacienMisAJour = pharmacienService.mettreAJourPharmacien(id, pharmacienDetails);
            return ResponseEntity.ok(pharmacienMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un pharmacien
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPharmacien(@PathVariable Long id) {
        pharmacienService.supprimerPharmacien(id);
        return ResponseEntity.noContent().build();
    }

    // Récupérer les pharmaciens actifs
    @GetMapping("/actifs")
    public ResponseEntity<List<Pharmacien>> obtenirPharmaciensActifs() {
        List<Pharmacien> pharmaciensActifs = pharmacienService.obtenirPharmaciensActifs();
        return ResponseEntity.ok(pharmaciensActifs);
    }

    // Récupérer les pharmaciens par numéro de licence
    @GetMapping("/numero-licence/{numeroLicence}")
    public ResponseEntity<List<Pharmacien>> obtenirPharmaciensParNumeroLicence(@PathVariable String numeroLicence) {
        List<Pharmacien> pharmaciens = pharmacienService.obtenirPharmaciensParNumeroLicence(numeroLicence);
        return ResponseEntity.ok(pharmaciens);
    }
}