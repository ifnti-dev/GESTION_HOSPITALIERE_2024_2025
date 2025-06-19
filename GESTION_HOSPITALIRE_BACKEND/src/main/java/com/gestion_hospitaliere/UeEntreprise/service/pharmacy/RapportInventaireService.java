package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.RapportInventaireRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.RapportInventaire; 

@Service
public class RapportInventaireService {
    private final RapportInventaireRepository rapportInventaireRepository;

    public RapportInventaireService(RapportInventaireRepository rapportInventaireRepository) {
        this.rapportInventaireRepository = rapportInventaireRepository;
    }

    public List<RapportInventaire> getAllRapportsInventaire() {
        return rapportInventaireRepository.findAll();
    }

    public RapportInventaire getRapportInventaireById(Long id) {
        return rapportInventaireRepository.findById(id).orElse(null);
    }

    public RapportInventaire saveRapportInventaire(RapportInventaire rapportInventaire) {
        return rapportInventaireRepository.save(rapportInventaire);
    }

    public void deleteRapportInventaire(Long id) {
        rapportInventaireRepository.deleteById(id);
    }

    public List<RapportInventaire> getByEmployeId(Long employeId) {
        return rapportInventaireRepository.findByEmployeId(employeId);
    }

    public List<RapportInventaire> getByDateRapport(String date) {
        return rapportInventaireRepository.findByDateRapport(date);
    }

    public List<RapportInventaire> searchByContenuContaining(String keyword) {
        return rapportInventaireRepository.findByContenuContaining(keyword);
    }
}
