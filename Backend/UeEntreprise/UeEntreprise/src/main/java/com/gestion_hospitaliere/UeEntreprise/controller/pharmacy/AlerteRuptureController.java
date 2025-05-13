package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.AlerteRupture;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.AlerteRuptureService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertes-rupture")
public class AlerteRuptureController {

    private final AlerteRuptureService alerteService;

    public AlerteRuptureController(AlerteRuptureService alerteService) {
        this.alerteService = alerteService;
    }

    @GetMapping
    public List<AlerteRupture> getAllAlertes() {
        return alerteService.getAllAlertes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlerteRupture> getAlerteById(@PathVariable Long id) {
        return ResponseEntity.ok(alerteService.getAlerteById(id));
    }

    @PostMapping
    public AlerteRupture createAlerte(@RequestBody AlerteRupture alerte) {
        return alerteService.createAlerte(alerte);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlerteRupture> updateAlerte(@PathVariable Long id, @RequestBody AlerteRupture alerteDetails) {
        return ResponseEntity.ok(alerteService.updateAlerte(id, alerteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlerte(@PathVariable Long id) {
        alerteService.deleteAlerte(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/medicament/{medicamentId}")
//    public List<AlerteRupture> getAlertesByMedicament(@PathVariable Long medicamentId) {
//        return alerteService.getAlertesByMedicament(medicamentId);
//    }
}