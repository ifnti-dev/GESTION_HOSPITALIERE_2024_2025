package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;


import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Approvisionnement;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.ApprovisionnementRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ApprovisionnementService {

    private final ApprovisionnementRepository approvisionnementRepository;

    public ApprovisionnementService(ApprovisionnementRepository approvisionnementRepository) {
        this.approvisionnementRepository = approvisionnementRepository;
    }

    public Approvisionnement createApprovisionnement(Approvisionnement approvisionnement) {
        return approvisionnementRepository.save(approvisionnement);
    }

    public Approvisionnement updateApprovisionnement(Long id, Approvisionnement approvisionnementDetails) {
        Approvisionnement approvisionnement = approvisionnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approvisionnement non trouvé"));
        approvisionnement.setDate(approvisionnementDetails.getDate());
        approvisionnement.setFactureNumero(approvisionnementDetails.getFactureNumero());
        return approvisionnementRepository.save(approvisionnement);
    }

    public List<Approvisionnement> getAllApprovisionnements() {
        return approvisionnementRepository.findAll();
    }

    public Approvisionnement getApprovisionnementById(Long id) {
        return approvisionnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approvisionnement non trouvé"));
    }

    public void deleteApprovisionnement(Long id) {
        approvisionnementRepository.deleteById(id);
    }

    public List<Approvisionnement> getApprovisionnementsByFournisseur(Long fournisseurId) {
        return approvisionnementRepository.findByFournisseurId(fournisseurId);
    }
}