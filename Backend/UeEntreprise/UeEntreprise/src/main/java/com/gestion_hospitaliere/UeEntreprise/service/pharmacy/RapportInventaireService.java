package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.RapportInventaire;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.RapportInventaireRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class RapportInventaireService {

    private final RapportInventaireRepository rapportRepository;

    public RapportInventaireService(RapportInventaireRepository rapportRepository) {
        this.rapportRepository = rapportRepository;
    }

    public RapportInventaire createRapport(RapportInventaire rapport) {
        rapport.setDateGeneration(LocalDate.now());
        return rapportRepository.save(rapport);
    }

    public RapportInventaire updateRapport(Long id, RapportInventaire rapportDetails) {
        RapportInventaire rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport non trouvé"));
        rapport.setContenu(rapportDetails.getContenu());
        return rapportRepository.save(rapport);
    }

    public List<RapportInventaire> getAllRapports() {
        return rapportRepository.findAll();
    }

    public RapportInventaire getRapportById(Long id) {
        return rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport non trouvé"));
    }

    public void deleteRapport(Long id) {
        rapportRepository.deleteById(id);
    }

    public List<RapportInventaire> getRapportsByDate(LocalDate date) {
        return rapportRepository.findByDateGeneration(date);
    }

    public List<RapportInventaire> getRapportsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return rapportRepository.findByDateGenerationBetween(startDate, endDate);
    }
}
