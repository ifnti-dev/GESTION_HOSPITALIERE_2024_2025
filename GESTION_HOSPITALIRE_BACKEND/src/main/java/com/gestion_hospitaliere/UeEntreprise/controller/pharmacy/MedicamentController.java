package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Medicament;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.MedicamentService;

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
    public Medicament getMedicamentById(@PathVariable Long id) {
        return medicamentService.getMedicamentById(id);
    }

    @PostMapping
    public Medicament createMedicament(@RequestBody Medicament medicament) {
        return medicamentService.saveMedicament(medicament);
    }

    @PutMapping("/{id}")
    public Medicament updateMedicament(@PathVariable Long id, @RequestBody Medicament medicament) {
        medicament.setId(id);
        return medicamentService.saveMedicament(medicament);
    }

    @DeleteMapping("/{id}")
    public void deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
    }

    @GetMapping("/search/nom")
    public List<Medicament> searchByNomContaining(@RequestParam String nom) {
        return medicamentService.searchByNomContaining(nom);
    }



    @GetMapping("/by-categorie/{categorieId}")
    public List<Medicament> getByCategorieId(@PathVariable Long categorieId) {
        return medicamentService.getByCategorieId(categorieId);
    }

    @GetMapping("/search/description")
    public List<Medicament> searchByDescriptionContaining(@RequestParam String keyword) {
        return medicamentService.searchByDescriptionContaining(keyword);
    }
}