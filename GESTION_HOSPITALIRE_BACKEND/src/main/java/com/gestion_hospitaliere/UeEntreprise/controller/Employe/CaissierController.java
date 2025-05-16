package com.gestion_hospitaliere.UeEntreprise.controller.Employe;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.CaissierService;

@RestController
@RequestMapping("/api/caissiers")
public class CaissierController {

    @Autowired
    private CaissierService caissierService;

    // Ajouter un nouveau caissier
    @PostMapping
    public ResponseEntity<Caissier> ajouterCaissier(@RequestBody Caissier caissier) {
        try {
            Caissier nouveauCaissier = caissierService.ajouterCaissier(caissier);
            return new ResponseEntity<>(nouveauCaissier, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Récupérer tous les caissiers
    @GetMapping
    public ResponseEntity<List<Caissier>> obtenirTousLesCaissiers() {
        List<Caissier> caissiers = caissierService.obtenirTousLesCaissiers();
        return new ResponseEntity<>(caissiers, HttpStatus.OK);
    }

    // Récupérer un caissier par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Caissier> obtenirCaissierParId(@PathVariable Long id) {
        Optional<Caissier> caissier = caissierService.obtenirCaissierParId(id);
        return caissier.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Mettre à jour un caissier
    @PutMapping("/{id}")
    public ResponseEntity<Caissier> mettreAJourCaissier(@PathVariable Long id, @RequestBody Caissier caissierDetails) {
        try {
            Caissier caissierMisAJour = caissierService.mettreAJourCaissier(id, caissierDetails);
            return new ResponseEntity<>(caissierMisAJour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Supprimer un caissier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerCaissier(@PathVariable Long id) {
        caissierService.supprimerCaissier(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Récupérer les caissiers actifs
    @GetMapping("/actifs")
    public ResponseEntity<List<Caissier>> obtenirCaissiersActifs() {
        List<Caissier> caissiersActifs = caissierService.obtenirCaissiersActifs();
        return new ResponseEntity<>(caissiersActifs, HttpStatus.OK);
    }

    // Récupérer les caissiers par horaires de travail
    @GetMapping("/horaires")
    public ResponseEntity<List<Caissier>> obtenirCaissiersParHoraires(@RequestParam String horairesTravail) {
        List<Caissier> caissiers = caissierService.obtenirCaissiersParHoraires(horairesTravail);
        return new ResponseEntity<>(caissiers, HttpStatus.OK);
    }

    // Récupérer les caissiers affectés après une certaine date
    @GetMapping("/affectes-apres")
    public ResponseEntity<List<Caissier>> obtenirCaissiersAffectesApres(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Caissier> caissiers = caissierService.obtenirCaissiersAffectesApres(localDate);
        return new ResponseEntity<>(caissiers, HttpStatus.OK);
    }

    // Récupérer les caissiers actifs avec pagination
    @GetMapping("/actifs/pagination")
    public ResponseEntity<Page<Caissier>> obtenirCaissiersActifsAvecPagination(Pageable pageable) {
        Page<Caissier> caissiers = caissierService.obtenirCaissiersActifsAvecPagination(pageable);
        return new ResponseEntity<>(caissiers, HttpStatus.OK);
    }
}