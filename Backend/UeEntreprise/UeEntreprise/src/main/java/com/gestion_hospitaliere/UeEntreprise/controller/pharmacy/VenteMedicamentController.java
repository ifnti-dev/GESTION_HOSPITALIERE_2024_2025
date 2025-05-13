package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.VenteMedicamentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ventes")
public class VenteMedicamentController {

    private final VenteMedicamentService venteService;

    public VenteMedicamentController(VenteMedicamentService venteService) {
        this.venteService = venteService;
    }

    @GetMapping
    public List<VenteMedicament> getAllVentes() {
        return venteService.getAllVentes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenteMedicament> getVenteById(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.getVenteById(id));
    }

//    @GetMapping("/{id}/details")
//    public ResponseEntity<VenteMedicament> getVenteWithDetails(@PathVariable Long id) {
//        return ResponseEntity.ok(venteService.getVenteWithLignes(id));
//    }

    @PostMapping
    public VenteMedicament createVente(@RequestBody VenteMedicament vente) {
        return venteService.createVente(vente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VenteMedicament> updateVente(@PathVariable Long id, @RequestBody VenteMedicament venteDetails) {
        return ResponseEntity.ok(venteService.updateVente(id, venteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVente(@PathVariable Long id) {
        venteService.deleteVente(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/patient/{patientId}")
//    public List<VenteMedicament> getVentesByPatient(@PathVariable Long patientId) {
//        return venteService.getVentesByPatient(patientId);
//    }
//
//    @GetMapping("/caissier/{caissierId}")
//    public List<VenteMedicament> getVentesByCaissier(@PathVariable Long caissierId) {
//        return venteService.getVentesByCaissier(caissierId);
//    }
//
//    @GetMapping("/pharmacien/{pharmacienId}")
//    public List<VenteMedicament> getVentesByPharmacien(@PathVariable Long pharmacienId) {
//        return venteService.getVentesByPharmacien(pharmacienId);
//    }
//
//    @GetMapping("/periode")
//    public List<VenteMedicament> getVentesBetweenDates(
//            @RequestParam String startDate,
//            @RequestParam String endDate) {
//        return venteService.getVentesBetweenDates(
//                LocalDate.parse(startDate),
//                LocalDate.parse(endDate));
//    }
//
//    @GetMapping("/chiffre-affaires")
//    public ResponseEntity<Double> calculateChiffreAffaires(
//            @RequestParam String startDate,
//            @RequestParam String endDate) {
//        return ResponseEntity.ok(venteService.calculateChiffreAffaires(
//                LocalDate.parse(startDate),
//                LocalDate.parse(endDate)));
//    }
}
