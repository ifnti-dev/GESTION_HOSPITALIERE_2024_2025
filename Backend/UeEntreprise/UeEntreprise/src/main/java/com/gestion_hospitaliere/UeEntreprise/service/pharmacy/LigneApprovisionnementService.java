package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LigneApprovisionnementService {

    private final LigneApprovisionnementRepository ligneRepository;

    public LigneApprovisionnementService(LigneApprovisionnementRepository ligneRepository) {
        this.ligneRepository = ligneRepository;
    }

    public LigneApprovisionnement createLigne(LigneApprovisionnement ligne) {
        return ligneRepository.save(ligne);
    }

    public LigneApprovisionnement updateLigne(Long id, LigneApprovisionnement ligneDetails) {
        LigneApprovisionnement ligne = ligneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
        ligne.setQuantite(ligneDetails.getQuantite());
        return ligneRepository.save(ligne);
    }

    public List<LigneApprovisionnement> getAllLignes() {
        return ligneRepository.findAll();
    }

    public LigneApprovisionnement getLigneById(Long id) {
        return ligneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
    }

    public void deleteLigne(Long id) {
        ligneRepository.deleteById(id);
    }

    public List<LigneApprovisionnement> getLignesByApprovisionnement(Long approvisionnementId) {
        return ligneRepository.findByApprovisionnementId(approvisionnementId);
    }

    public List<LigneApprovisionnement> getLignesByMedicament(Long medicamentId) {
        return ligneRepository.findByMedicamentId(medicamentId);
    }
}