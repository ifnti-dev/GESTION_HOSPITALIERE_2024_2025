package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.SageFemmeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy.AccouchementRepository;

@Service
public class AccouchementService {

    @Autowired
    private AccouchementRepository accouchementRepository;

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private SageFemmeRepository sageFemmeRepository;

    public List<Accouchement> getAll() {
        return accouchementRepository.findAll();
    }

    public Optional<Accouchement> getById(Long id) {
        return accouchementRepository.findById(id);
    }

    public List<Accouchement> getByDossierGrossesseId(Long dossierId) {
        return accouchementRepository.findByDossierGrossesseId(dossierId);
    }

    public List<Accouchement> getBySageFemmeId(Long sageFemmeId) {
        return accouchementRepository.findBySageFemmeId(sageFemmeId);
    }

    public Accouchement create(Accouchement accouchement) {
        Long dossierId = accouchement.getDossierGrossesse().getId();
        Long sageFemmeId = accouchement.getSageFemme().getId();

        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        SageFemme sageFemme = sageFemmeRepository.findById(sageFemmeId)
                .orElseThrow(() -> new RuntimeException("SageFemme non trouvée avec l'id: " + sageFemmeId));

        accouchement.setDossierGrossesse(dossier);
        accouchement.setSageFemme(sageFemme);

        return accouchementRepository.save(accouchement);
    }

    public Accouchement update(Long id, Accouchement updated) {
        if (!accouchementRepository.existsById(id)) {
            throw new RuntimeException("Accouchement non trouvé avec l'id: " + id);
        }

        Long dossierId = updated.getDossierGrossesse().getId();
        Long sageFemmeId = updated.getSageFemme().getId();

        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        SageFemme sageFemme = sageFemmeRepository.findById(sageFemmeId)
                .orElseThrow(() -> new RuntimeException("SageFemme non trouvée avec l'id: " + sageFemmeId));

        updated.setId(id);
        updated.setDossierGrossesse(dossier);
        updated.setSageFemme(sageFemme);

        return accouchementRepository.save(updated);
    }

    public void delete(Long id) {
        accouchementRepository.deleteById(id);
    }
}