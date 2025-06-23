package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.ApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Approvisionnement;

@Service
public class ApprovisionnementService {
    private final ApprovisionnementRepository approvisionnementRepository;

    public ApprovisionnementService(ApprovisionnementRepository approvisionnementRepository) {
        this.approvisionnementRepository = approvisionnementRepository;
    }

    public List<Approvisionnement> getAllApprovisionnements() {
        return approvisionnementRepository.findAll();
    }

    public Approvisionnement getApprovisionnementById(Long id) {
        return approvisionnementRepository.findById(id).orElse(null);
    }

    public Approvisionnement saveApprovisionnement(Approvisionnement approvisionnement) {
        return approvisionnementRepository.save(approvisionnement);
    }

    public void deleteApprovisionnement(Long id) {
        approvisionnementRepository.deleteById(id);
    }

    public List<Approvisionnement> getApprovisionnementsByDate(LocalDate date) {
        return approvisionnementRepository.findByDateAppro(date);
    }

    public List<Approvisionnement> getApprovisionnementsByFournisseur(String fournisseur) {
        return approvisionnementRepository.findByFournisseur(fournisseur);
    }

    public List<Approvisionnement> getApprovisionnementsByEmployeId(Long employeId) {
        return approvisionnementRepository.findByEmployeId(employeId);
    }
}