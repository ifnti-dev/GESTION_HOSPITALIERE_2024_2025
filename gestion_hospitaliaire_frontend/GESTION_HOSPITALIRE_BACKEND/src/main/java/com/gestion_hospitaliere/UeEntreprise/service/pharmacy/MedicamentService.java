package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Medicament;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.MedicamentRepository;

@Service
public class MedicamentService {
    private final MedicamentRepository medicamentRepository;

    public MedicamentService(MedicamentRepository medicamentRepository) {
        this.medicamentRepository = medicamentRepository;
    }

    public List<Medicament> getAllMedicaments() {
        return medicamentRepository.findAll();
    }

    public Medicament getMedicamentById(Long id) {
        return medicamentRepository.findById(id).orElse(null);
    }

    public Medicament saveMedicament(Medicament medicament) {
        return medicamentRepository.save(medicament);
    }

    public void deleteMedicament(Long id) {
        medicamentRepository.deleteById(id);
    }

    public List<Medicament> searchByNomContaining(String nom) {
        return medicamentRepository.findByNomContaining(nom);
    }

    public List<Medicament> getMedicamentsLowStock(Integer seuil) {
        return medicamentRepository.findByStockTotalLessThan(seuil);
    }

    public List<Medicament> getByCategorieId(Long categorieId) {
        return medicamentRepository.findByCategorieId(categorieId);
    }

    public List<Medicament> searchByDescriptionContaining(String keyword) {
        return medicamentRepository.findByDescriptionContaining(keyword);
    }
}
