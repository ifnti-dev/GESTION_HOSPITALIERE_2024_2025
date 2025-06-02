package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.CategorieMedicament;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.CategorieMedicamentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories-medicament")
public class CategorieMedicamentController {

    private final CategorieMedicamentService categorieService;

    public CategorieMedicamentController(CategorieMedicamentService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public List<CategorieMedicament> getAllCategories() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieMedicament> getCategorieById(@PathVariable Long id) {
        return ResponseEntity.ok(categorieService.getCategorieById(id));
    }

    @PostMapping
    public CategorieMedicament createCategorie(@RequestBody CategorieMedicament categorie) {
        return categorieService.createCategorie(categorie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategorieMedicament> updateCategorie(@PathVariable Long id, @RequestBody CategorieMedicament categorieDetails) {
        return ResponseEntity.ok(categorieService.updateCategorie(id, categorieDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nom/{nom}")
    public ResponseEntity<CategorieMedicament> getCategorieByNom(@PathVariable String nom) {
        return ResponseEntity.ok(categorieService.getCategorieByNom(nom));
    }
}