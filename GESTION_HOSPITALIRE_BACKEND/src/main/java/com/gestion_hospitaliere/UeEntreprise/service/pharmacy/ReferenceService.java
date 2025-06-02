package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Reference;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.ReferenceRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReferenceService {

    private final ReferenceRepository referenceRepository;

    public ReferenceService(ReferenceRepository referenceRepository) {
        this.referenceRepository = referenceRepository;
    }

    public Reference createReference(Reference reference) {
        return referenceRepository.save(reference);
    }

    public Reference updateReference(Long id, Reference referenceDetails) {
        Reference reference = referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Référence non trouvée"));
        reference.setNom(referenceDetails.getNom());
        reference.setDescription(referenceDetails.getDescription());
        return referenceRepository.save(reference);
    }

    public List<Reference> getAllReferences() {
        return referenceRepository.findAll();
    }

    public Reference getReferenceById(Long id) {
        return referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Référence non trouvée"));
    }

    public void deleteReference(Long id) {
        referenceRepository.deleteById(id);
    }

    public List<Reference> getReferencesByMedicament(Long medicamentId) {
        return referenceRepository.findByMedicamentId(medicamentId);
    }

    public List<Reference> searchReferencesByName(String nom) {
        return referenceRepository.findByNomContaining(nom);
    }
}
