package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.MedicamentReferenceRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.MedicamentReference;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class MedicamentReferenceService {

    private final MedicamentReferenceRepository medicamentReferenceRepository;

    public MedicamentReferenceService(MedicamentReferenceRepository medicamentReferenceRepository) {
        this.medicamentReferenceRepository = medicamentReferenceRepository;
    }

    // Créer une nouvelle association Medicament-Reference
    public MedicamentReference createMedicamentReference(MedicamentReference medicamentReference) {
        return medicamentReferenceRepository.save(medicamentReference);
    }

    // Mettre à jour une association existante
    public MedicamentReference updateMedicamentReference(Long id, MedicamentReference medicamentReferenceDetails) {
        MedicamentReference medicamentReference = medicamentReferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Association Medicament-Reference non trouvée avec l'id: " + id));
        
        medicamentReference.setQuantite(medicamentReferenceDetails.getQuantite());
        
        // On ne change pas les références aux entités liées dans une mise à jour standard
        // pour éviter les problèmes de cohérence
        
        return medicamentReferenceRepository.save(medicamentReference);
    }

    // Récupérer toutes les associations
    public List<MedicamentReference> getAllMedicamentReferences() {
        return medicamentReferenceRepository.findAll();
    }

    // Récupérer une association par son ID
    public MedicamentReference getMedicamentReferenceById(Long id) {
        return medicamentReferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Association Medicament-Reference non trouvée avec l'id: " + id));
    }

    // Supprimer une association
    public void deleteMedicamentReference(Long id) {
        if (!medicamentReferenceRepository.existsById(id)) {
            throw new RuntimeException("Association Medicament-Reference non trouvée avec l'id: " + id);
        }
        medicamentReferenceRepository.deleteById(id);
    }

    // Méthodes spécifiques
    public List<MedicamentReference> getByMedicamentId(Long medicamentId) {
        return medicamentReferenceRepository.findByMedicamentId(medicamentId);
    }

    public List<MedicamentReference> getByReferenceId(Long referenceId) {
        return medicamentReferenceRepository.findByReferenceId(referenceId);
    }

    public List<MedicamentReference> getByQuantiteGreaterThan(Integer quantite) {
        return medicamentReferenceRepository.findByQuantiteGreaterThan(quantite);
    }

    public MedicamentReference getByMedicamentAndReference(Long medicamentId, Long referenceId) {
        List<MedicamentReference> results = medicamentReferenceRepository
                .findByMedicamentIdAndReferenceId(medicamentId, referenceId);
        
        if (results.isEmpty()) {
            return null;
        }
        return results.get(0);
    }
}