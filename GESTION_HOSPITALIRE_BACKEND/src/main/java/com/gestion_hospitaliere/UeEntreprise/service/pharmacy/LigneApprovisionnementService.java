package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;

@Service
public class LigneApprovisionnementService {
    private final LigneApprovisionnementRepository ligneApprovisionnementRepository;

    public LigneApprovisionnementService(LigneApprovisionnementRepository ligneApprovisionnementRepository) {
        this.ligneApprovisionnementRepository = ligneApprovisionnementRepository;
    }

    public List<LigneApprovisionnement> getAllLignesApprovisionnement() {
        return ligneApprovisionnementRepository.findAll();
    }

    public LigneApprovisionnement getLigneApprovisionnementById(Long id) {
        return ligneApprovisionnementRepository.findById(id).orElse(null);
    }

    public LigneApprovisionnement saveLigneApprovisionnement(LigneApprovisionnement ligneApprovisionnement) {
        return ligneApprovisionnementRepository.save(ligneApprovisionnement);
    }

    public void deleteLigneApprovisionnement(Long id) {
        ligneApprovisionnementRepository.deleteById(id);
    }

    public List<LigneApprovisionnement> getByApprovisionnementId(Long approvisionnementId) {
        return ligneApprovisionnementRepository.findByApprovisionnementId(approvisionnementId);
    }

//    public List<LigneApprovisionnement> getByMedicamentId(Long medicamentId) {
//        return ligneApprovisionnementRepository.findByMedicamentId(medicamentId);
//    }

    public List<LigneApprovisionnement> getByDateExpirationBefore(LocalDate date) {
        return ligneApprovisionnementRepository.findByDateExpirationBefore(date);
    }
}