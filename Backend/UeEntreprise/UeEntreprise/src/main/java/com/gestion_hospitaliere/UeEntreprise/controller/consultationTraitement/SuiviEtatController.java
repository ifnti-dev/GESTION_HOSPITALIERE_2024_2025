package com.gestion_hospitaliere.UeEntreprise.controller.consultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.service.consultationTraitement.SuiviEtatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/suivi-etats")
public class SuiviEtatController {

    private final SuiviEtatService suiviEtatService;

    @Autowired
    public SuiviEtatController(SuiviEtatService suiviEtatService) {
        this.suiviEtatService = suiviEtatService;
    }

    @GetMapping
    public ResponseEntity<List<SuiviEtat>> getAllSuiviEtats() {
        List<SuiviEtat> suiviEtats = suiviEtatService.getAllSuiviEtats();
        return ResponseEntity.ok(suiviEtats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuiviEtat> getSuiviEtatById(@PathVariable Long id) {
        Optional<SuiviEtat> suiviEtat = suiviEtatService.getSuiviEtatById(id);
        return suiviEtat.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SuiviEtat> createSuiviEtat(@RequestBody SuiviEtat suiviEtat) {
        SuiviEtat savedSuiviEtat = suiviEtatService.saveSuiviEtat(suiviEtat);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSuiviEtat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiviEtat> updateSuiviEtat(@PathVariable Long id, @RequestBody SuiviEtat suiviEtatDetails) {
        try {
            SuiviEtat updatedSuiviEtat = suiviEtatService.updateSuiviEtat(id, suiviEtatDetails);
            return ResponseEntity.ok(updatedSuiviEtat);
        } catch (RuntimeException e) {
            // Gérer l'exception si le suivi d'état n'est pas trouvé
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSuiviEtat(@PathVariable Long id) {
        try {
            suiviEtatService.deleteSuiviEtat(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Gérer l'exception si le suivi d'état n'est pas trouvé
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Recherche les SuiviEtat par ID de consultation et après une certaine date.
     * Exemple d'URL: /api/v1/suivi-etats/search/by-consultation-and-date-after?consultationId=1&date=2023-01-01
     */
    // @GetMapping("/search/by-consultation-and-date-after")
    // public ResponseEntity<List<SuiviEtat>> findSuiviEtatsByConsultationAndDateAfter(
    //         @RequestParam Long consultationId,
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    //     List<SuiviEtat> suiviEtats = suiviEtatService.findByConsultationIdAndDateSuiviAfter(consultationId, date);
    //     return ResponseEntity.ok(suiviEtats);
    // }
}