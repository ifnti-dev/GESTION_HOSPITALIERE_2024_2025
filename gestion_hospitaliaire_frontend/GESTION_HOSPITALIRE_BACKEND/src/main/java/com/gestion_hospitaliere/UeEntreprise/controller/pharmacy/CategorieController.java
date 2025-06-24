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

import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.CategorieService;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Categorie;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {
    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public List<Categorie> getAllCategories() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Categorie getCategorieById(@PathVariable Long id) {
        return categorieService.getCategorieById(id);
    }

    @PostMapping
    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieService.saveCategorie(categorie);
    }

    @PutMapping("/{id}")
    public Categorie updateCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        categorie.setId(id);
        return categorieService.saveCategorie(categorie);
    }

    @DeleteMapping("/{id}")
    public void deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
    }

    @GetMapping("/search/nom")
    public List<Categorie> searchByNomContaining(@RequestParam String nom) {
        return categorieService.searchByNomContaining(nom);
    }

    @GetMapping("/search/description")
    public List<Categorie> searchByDescriptionContaining(@RequestParam String description) {
        return categorieService.searchByDescriptionContaining(description);
    }
}
