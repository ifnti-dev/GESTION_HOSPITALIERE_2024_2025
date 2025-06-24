package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneCommandeRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;

@Service
public class LigneCommandeService {
    private final LigneCommandeRepository ligneCommandeRepository;

    public LigneCommandeService(LigneCommandeRepository ligneCommandeRepository) {
        this.ligneCommandeRepository = ligneCommandeRepository;
    }

    public List<LigneCommande> getAllLignesCommande() {
        return ligneCommandeRepository.findAll();
    }

    public LigneCommande getLigneCommandeById(Long id) {
        return ligneCommandeRepository.findById(id).orElse(null);
    }

    public LigneCommande saveLigneCommande(LigneCommande ligneCommande) {
        return ligneCommandeRepository.save(ligneCommande);
    }

    public void deleteLigneCommande(Long id) {
        ligneCommandeRepository.deleteById(id);
    }

    public List<LigneCommande> getByCommandeId(Long commandeId) {
        return ligneCommandeRepository.findByCommandeId(commandeId);
    }

    public List<LigneCommande> getByMedicamentId(Long medicamentId) {
        return ligneCommandeRepository.findByMedicamentId(medicamentId);
    }

    public List<LigneCommande> getByPrixUnitaireGreaterThan(Integer prix) {
        return ligneCommandeRepository.findByPrixUnitaireGreaterThan(prix);
    }
}