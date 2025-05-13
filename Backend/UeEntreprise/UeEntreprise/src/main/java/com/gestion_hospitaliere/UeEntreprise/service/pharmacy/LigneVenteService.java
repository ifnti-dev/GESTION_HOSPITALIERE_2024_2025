package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;


import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.LigneVente;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneVenteRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LigneVenteService {

    private final LigneVenteRepository ligneVenteRepository;

    public LigneVenteService(LigneVenteRepository ligneVenteRepository) {
        this.ligneVenteRepository = ligneVenteRepository;
    }

    public LigneVente createLigneVente(LigneVente ligneVente) {
        return ligneVenteRepository.save(ligneVente);
    }

    public LigneVente updateLigneVente(Long id, LigneVente ligneVenteDetails) {
        LigneVente ligneVente = ligneVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de vente non trouvée"));
        ligneVente.setQuantite(ligneVenteDetails.getQuantite());
        return ligneVenteRepository.save(ligneVente);
    }

    public List<LigneVente> getAllLignesVente() {
        return ligneVenteRepository.findAll();
    }

    public LigneVente getLigneVenteById(Long id) {
        return ligneVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de vente non trouvée"));
    }

    public void deleteLigneVente(Long id) {
        ligneVenteRepository.deleteById(id);
    }

    public List<LigneVente> getLignesByVente(Long venteId) {
        return ligneVenteRepository.findByVenteId(venteId);
    }

    public List<LigneVente> getLignesByMedicament(Long medicamentId) {
        return ligneVenteRepository.findByMedicamentId(medicamentId);
    }
}