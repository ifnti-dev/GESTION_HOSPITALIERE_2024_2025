package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;



import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.AlerteRupture;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.AlerteRuptureRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlerteRuptureService {

    private final AlerteRuptureRepository alerteRuptureRepository;

    public AlerteRuptureService(AlerteRuptureRepository alerteRuptureRepository) {
        this.alerteRuptureRepository = alerteRuptureRepository;
    }

    public AlerteRupture createAlerte(AlerteRupture alerte) {
        return alerteRuptureRepository.save(alerte);
    }

    public AlerteRupture updateAlerte(Long id, AlerteRupture alerteDetails) {
        AlerteRupture alerte = alerteRuptureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
        alerte.setMessage(alerteDetails.getMessage());
        alerte.setDateAlerte(alerteDetails.getDateAlerte());
        alerte.setEstFrelate(alerteDetails.getEstFrelate());
        return alerteRuptureRepository.save(alerte);
    }

    public List<AlerteRupture> getAllAlertes() {
        return alerteRuptureRepository.findAll();
    }

    public AlerteRupture getAlerteById(Long id) {
        return alerteRuptureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
    }

    public void deleteAlerte(Long id) {
        alerteRuptureRepository.deleteById(id);
    }

//    public List<AlerteRupture> getAlertesByMedicament(Long medicamentId) {
//        return alerteRuptureRepository.findByMedicamentId(medicamentId);
//    }
}