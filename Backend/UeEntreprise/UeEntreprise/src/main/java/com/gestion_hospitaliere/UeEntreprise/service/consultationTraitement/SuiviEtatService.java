package com.gestion_hospitaliere.UeEntreprise.service.consultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.repository.consultationTraitement.SuiviEtatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SuiviEtatService {

    @Autowired
    private final SuiviEtatRepository suiviEtatRepository;

    
    public SuiviEtatService(SuiviEtatRepository suiviEtatRepository) {
        this.suiviEtatRepository = suiviEtatRepository;
    }

    public List<SuiviEtat> getAllSuiviEtats() {
        return suiviEtatRepository.findAll();
    }

    public Optional<SuiviEtat> getSuiviEtatById(Long id) {
        return suiviEtatRepository.findById(id);
    }

    public SuiviEtat saveSuiviEtat(SuiviEtat suiviEtat) {
        return suiviEtatRepository.save(suiviEtat);
    }

    public SuiviEtat updateSuiviEtat(Long id, SuiviEtat suiviEtatDetails) {
        SuiviEtat suiviEtat = suiviEtatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SuiviEtat non trouvé avec l'id : " + id));

        // Mettre à jour les champs de suiviEtat. Exemple :
        // suiviEtat.setDescription(suiviEtatDetails.getDescription());
        // suiviEtat.setDateSuivi(suiviEtatDetails.getDateSuivi());
        // ...

        suiviEtatDetails.setId(id); // Assurez-vous que l'ID est correct
        return suiviEtatRepository.save(suiviEtatDetails);
    }

    public void deleteSuiviEtat(Long id) {
        if (!suiviEtatRepository.existsById(id)) {
            throw new RuntimeException("SuiviEtat non trouvé avec l'id : " + id + " pour la suppression.");
        }
        suiviEtatRepository.deleteById(id);
    }

    // Utilisation de la méthode personnalisée du repository
   // public List<SuiviEtat> findByConsultationIdAndDateSuiviAfter(Long consultationId, LocalDate date) {
      //  return suiviEtatRepository.findByConsultationIdAndDateSuiviAfter(consultationId, date);
    }
//}