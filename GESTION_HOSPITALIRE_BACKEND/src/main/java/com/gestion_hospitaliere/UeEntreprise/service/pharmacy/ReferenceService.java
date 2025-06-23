package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Reference;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.ReferenceRepository;

@Service
public class ReferenceService {
    private final ReferenceRepository referenceRepository;

    public ReferenceService(ReferenceRepository referenceRepository) {
        this.referenceRepository = referenceRepository;
    }

    public List<Reference> getAllReferences() {
        return referenceRepository.findAll();
    }

    public Reference getReferenceById(Long id) {
        return referenceRepository.findById(id).orElse(null);
    }

    public Reference saveReference(Reference reference) {
        return referenceRepository.save(reference);
    }

    public void deleteReference(Long id) {
        referenceRepository.deleteById(id);
    }

    public List<Reference> searchByNomContaining(String nom) {
        return referenceRepository.findByNomContaining(nom);
    }

//    public List<Reference> getByMedicamentId(Long medicamentId) {
//        return referenceRepository.findByMedicamentId(medicamentId);
//    }

//    public List<Reference> getByQuantiteCalculeeGreaterThan(Integer quantite) {
//        return referenceRepository.findByQuantiteCalculeeGreaterThan(quantite);
//    }
}