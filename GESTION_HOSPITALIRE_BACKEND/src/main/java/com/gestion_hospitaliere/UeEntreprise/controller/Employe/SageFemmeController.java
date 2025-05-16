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

import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.SageFemmeService;

@RestController
@RequestMapping("/api/sages-femmes")
public class SageFemmeController {

    @Autowired
    private SageFemmeService sageFemmeService;

    // Ajouter une sage-femme
    @PostMapping
    public ResponseEntity<SageFemme> ajouterSageFemme(@RequestBody SageFemme sageFemme) {
        SageFemme nouvelleSageFemme = sageFemmeService.ajouterSageFemme(sageFemme);
        return ResponseEntity.ok(nouvelleSageFemme);
    }

    // Récupérer toutes les sages-femmes
    @GetMapping
    public ResponseEntity<List<SageFemme>> obtenirToutesLesSagesFemmes() {
        List<SageFemme> sagesFemmes = sageFemmeService.obtenirToutesLesSagesFemmes();
        return ResponseEntity.ok(sagesFemmes);
    }

    // Récupérer une sage-femme par ID
    @GetMapping("/{id}")
    public ResponseEntity<SageFemme> obtenirSageFemmeParId(@PathVariable Long id) {
        Optional<SageFemme> sageFemme = sageFemmeService.obtenirSageFemmeParId(id);
        return sageFemme.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Mettre à jour une sage-femme
    @PutMapping("/{id}")
    public ResponseEntity<SageFemme> mettreAJourSageFemme(@PathVariable Long id, @RequestBody SageFemme sageFemmeDetails) {
        try {
            SageFemme sageFemmeMisAJour = sageFemmeService.mettreAJourSageFemme(id, sageFemmeDetails);
            return ResponseEntity.ok(sageFemmeMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer une sage-femme
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerSageFemme(@PathVariable Long id) {
        sageFemmeService.supprimerSageFemme(id);
        return ResponseEntity.noContent().build();
    }

    // Récupérer les sages-femmes actives
    @GetMapping("/actives")
    public ResponseEntity<List<SageFemme>> obtenirSagesFemmesActives() {
        List<SageFemme> sagesFemmesActives = sageFemmeService.obtenirSagesFemmesActives();
        return ResponseEntity.ok(sagesFemmesActives);
    }

    // Récupérer les sages-femmes par spécialité
    @GetMapping("/specialite/{specialite}")
    public ResponseEntity<List<SageFemme>> obtenirSagesFemmesParSpecialite(@PathVariable String specialite) {
        List<SageFemme> sagesFemmes = sageFemmeService.obtenirSagesFemmesParSpecialite(specialite);
        return ResponseEntity.ok(sagesFemmes);
    }

    // Récupérer les sages-femmes par service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<SageFemme>> obtenirSagesFemmesParService(@PathVariable Long serviceId) {
        List<SageFemme> sagesFemmes = sageFemmeService.obtenirSagesFemmesParService(serviceId);
        return ResponseEntity.ok(sagesFemmes);
    }
}