package com.gestion_hospitaliere.UeEntreprise.controller.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Infirmier;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.InfirmierService;

@RestController
@RequestMapping("/api/infirmiers")
public class InfirmierController {

    @Autowired
    private InfirmierService infirmierService;

    // Ajouter un nouvel infirmier
    @PostMapping
    public ResponseEntity<Infirmier> ajouterInfirmier(@RequestBody Infirmier infirmier) {
        try {
            Infirmier nouvelInfirmier = infirmierService.ajouterInfirmier(infirmier);
            return new ResponseEntity<>(nouvelInfirmier, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Récupérer tous les infirmiers
    @GetMapping
    public ResponseEntity<List<Infirmier>> obtenirTousLesInfirmiers() {
        List<Infirmier> infirmiers = infirmierService.obtenirTousLesInfirmiers();
        return new ResponseEntity<>(infirmiers, HttpStatus.OK);
    }

    // Récupérer un infirmier par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Infirmier> obtenirInfirmierParId(@PathVariable Long id) {
        Optional<Infirmier> infirmier = infirmierService.obtenirInfirmierParId(id);
        return infirmier.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Mettre à jour un infirmier
    @PutMapping("/{id}")
    public ResponseEntity<Infirmier> mettreAJourInfirmier(@PathVariable Long id, @RequestBody Infirmier infirmierDetails) {
        try {
            Infirmier infirmierMisAJour = infirmierService.mettreAJourInfirmier(id, infirmierDetails);
            return new ResponseEntity<>(infirmierMisAJour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Supprimer un infirmier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerInfirmier(@PathVariable Long id) {
        try {
            infirmierService.supprimerInfirmier(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Récupérer les infirmiers actifs
    @GetMapping("/actifs")
    public ResponseEntity<List<Infirmier>> obtenirInfirmiersActifs() {
        List<Infirmier> infirmiersActifs = infirmierService.obtenirInfirmiersActifs();
        return new ResponseEntity<>(infirmiersActifs, HttpStatus.OK);
    }
}