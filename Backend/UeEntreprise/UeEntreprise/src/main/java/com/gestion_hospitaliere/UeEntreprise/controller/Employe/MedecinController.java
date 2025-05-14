package com.gestion_hospitaliere.UeEntreprise.controller.Employe;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.MedecinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medecins")
public class MedecinController {

    @Autowired
    private MedecinService medecinService;

    // Ajouter un nouveau médecin
    @PostMapping
    public ResponseEntity<Medecin> ajouterMedecin(@RequestBody Medecin medecin) {
        try {
            Medecin nouveauMedecin = medecinService.ajouterMedecin(medecin);
            return new ResponseEntity<>(nouveauMedecin, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Récupérer tous les médecins
    @GetMapping
    public ResponseEntity<List<Medecin>> obtenirTousLesMedecins() {
        List<Medecin> medecins = medecinService.obtenirTousLesMedecins();
        return new ResponseEntity<>(medecins, HttpStatus.OK);
    }

    // Récupérer un médecin par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Medecin> obtenirMedecinParId(@PathVariable Long id) {
        Optional<Medecin> medecin = medecinService.obtenirMedecinParId(id);
        return medecin.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Mettre à jour un médecin
    @PutMapping("/{id}")
    public ResponseEntity<Medecin> mettreAJourMedecin(@PathVariable Long id, @RequestBody Medecin medecinDetails) {
        try {
            Medecin medecinMisAJour = medecinService.mettreAJourMedecin(id, medecinDetails);
            return new ResponseEntity<>(medecinMisAJour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Supprimer un médecin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerMedecin(@PathVariable Long id) {
        try {
            medecinService.supprimerMedecin(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Récupérer les médecins actifs
    @GetMapping("/actifs")
    public ResponseEntity<List<Medecin>> obtenirMedecinsActifs() {
        List<Medecin> medecinsActifs = medecinService.obtenirMedecinsActifs();
        return new ResponseEntity<>(medecinsActifs, HttpStatus.OK);
    }

    // Récupérer les médecins par spécialité
    @GetMapping("/specialite")
    public ResponseEntity<List<Medecin>> obtenirMedecinsParSpecialite(@RequestParam String specialite) {
        List<Medecin> medecins = medecinService.obtenirMedecinsParSpecialite(specialite);
        return new ResponseEntity<>(medecins, HttpStatus.OK);
    }

    // Récupérer les médecins par service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Medecin>> obtenirMedecinsParService(@PathVariable Long serviceId) {
        List<Medecin> medecins = medecinService.obtenirMedecinsParService(serviceId);
        return new ResponseEntity<>(medecins, HttpStatus.OK);
    }
}
