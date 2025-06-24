package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.CategorieRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Categorie;

@Service
public class CategorieService {
    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    public Categorie getCategorieById(Long id) {
        return categorieRepository.findById(id).orElse(null);
    }

    public Categorie saveCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }

    public List<Categorie> searchByNomContaining(String nom) {
        return categorieRepository.findByNomContaining(nom);
    }

    public List<Categorie> searchByDescriptionContaining(String description) {
        return categorieRepository.findByDescriptionContaining(description);
    }
}