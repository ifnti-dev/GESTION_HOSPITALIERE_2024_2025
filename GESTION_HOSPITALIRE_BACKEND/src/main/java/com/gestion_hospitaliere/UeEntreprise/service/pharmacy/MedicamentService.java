package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;


import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.MedicamentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MedicamentService {

    private final MedicamentRepository medicamentRepository;

    public MedicamentService(MedicamentRepository medicamentRepository) {
        this.medicamentRepository = medicamentRepository;
    }

    public Medicament createMedicament(Medicament medicament) {
        return medicamentRepository.save(medicament);
    }

    public Medicament updateMedicament(Long id, Medicament medicamentDetails) {
        Medicament medicament = medicamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));
        medicament.setNom(medicamentDetails.getNom());
        medicament.setDescription(medicamentDetails.getDescription());
        medicament.setUnite(medicamentDetails.getUnite());
        medicament.setSeuilAlerte(medicamentDetails.getSeuilAlerte());
        medicament.setEstActif(medicamentDetails.getEstActif());
        return medicamentRepository.save(medicament);
    }

    public List<Medicament> getAllMedicaments() {
        return medicamentRepository.findAll();
    }

    public Medicament getMedicamentById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));
    }

    public void deleteMedicament(Long id) {
        medicamentRepository.deleteById(id);
    }

    public List<Medicament> searchMedicamentsByName(String nom) {
        return medicamentRepository.findByNomContaining(nom);
    }

    public List<Medicament> getMedicamentsByCategorie(Long categorieId) {
        return medicamentRepository.findByCategorieId(categorieId);
    }

    public List<Medicament> getActiveMedicaments() {
        return medicamentRepository.findByEstActifTrue();
    }
}