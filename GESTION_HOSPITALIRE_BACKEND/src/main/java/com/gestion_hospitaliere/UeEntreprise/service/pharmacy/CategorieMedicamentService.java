package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.CategorieMedicament;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.CategorieMedicamentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategorieMedicamentService {

    private final CategorieMedicamentRepository categorieRepository;

    public CategorieMedicamentService(CategorieMedicamentRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public CategorieMedicament createCategorie(CategorieMedicament categorie) {
        return categorieRepository.save(categorie);
    }

    public CategorieMedicament updateCategorie(Long id, CategorieMedicament categorieDetails) {
        CategorieMedicament categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        categorie.setNom(categorieDetails.getNom());
        categorie.setDescription(categorieDetails.getDescription());
        return categorieRepository.save(categorie);
    }

    public List<CategorieMedicament> getAllCategories() {
        return categorieRepository.findAll();
    }

    public CategorieMedicament getCategorieById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
    }

    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }

    public CategorieMedicament getCategorieByNom(String nom) {
        return categorieRepository.findByNom(nom);
    }
}
