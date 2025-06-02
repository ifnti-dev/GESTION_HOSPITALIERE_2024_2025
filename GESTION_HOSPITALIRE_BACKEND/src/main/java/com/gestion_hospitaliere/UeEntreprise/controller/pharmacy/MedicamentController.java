package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.MedicamentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaments")
public class MedicamentController {

    private final MedicamentService medicamentService;

    public MedicamentController(MedicamentService medicamentService) {
        this.medicamentService = medicamentService;
    }

    @GetMapping
    public List<Medicament> getAllMedicaments() {
        return medicamentService.getAllMedicaments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicament> getMedicamentById(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentService.getMedicamentById(id));
    }

    @PostMapping
    public Medicament createMedicament(@RequestBody Medicament medicament) {
        return medicamentService.createMedicament(medicament);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicament> updateMedicament(@PathVariable Long id, @RequestBody Medicament medicamentDetails) {
        return ResponseEntity.ok(medicamentService.updateMedicament(id, medicamentDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Medicament> searchMedicamentsByName(@RequestParam String nom) {
        return medicamentService.searchMedicamentsByName(nom);
    }

    @GetMapping("/categorie/{categorieId}")
    public List<Medicament> getMedicamentsByCategorie(@PathVariable Long categorieId) {
        return medicamentService.getMedicamentsByCategorie(categorieId);
    }

    @GetMapping("/actifs")
    public List<Medicament> getActiveMedicaments() {
        return medicamentService.getActiveMedicaments();
    }
}