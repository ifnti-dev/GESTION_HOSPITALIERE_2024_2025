package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy.SuiviGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;

@Service
public class SuiviGrossesseService {

    @Autowired
    private SuiviGrossesseRepository suiviGrossesseRepository;

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    public List<SuiviGrossesse> getAll() {
        return suiviGrossesseRepository.findAll();
    }

    public Optional<SuiviGrossesse> getById(Long id) {
        return suiviGrossesseRepository.findById(id);
    }

    public List<SuiviGrossesse> getByDossierGrossesseId(Long dossierId) {
        return suiviGrossesseRepository.findByDossierGrossesseId(dossierId);
    }

    public SuiviGrossesse create(SuiviGrossesse suivi) {
        Long dossierId = suivi.getDossierGrossesse().getId();
        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        suivi.setDossierGrossesse(dossier);
        return suiviGrossesseRepository.save(suivi);
    }

    public SuiviGrossesse update(Long id, SuiviGrossesse updated) {
        if (!suiviGrossesseRepository.existsById(id)) {
            throw new RuntimeException("SuiviGrossesse non trouvé avec l'id: " + id);
        }
        Long dossierId = updated.getDossierGrossesse().getId();
        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        updated.setId(id);
        updated.setDossierGrossesse(dossier);
        return suiviGrossesseRepository.save(updated);
    }

    public void delete(Long id) {
        suiviGrossesseRepository.deleteById(id);
    }
}