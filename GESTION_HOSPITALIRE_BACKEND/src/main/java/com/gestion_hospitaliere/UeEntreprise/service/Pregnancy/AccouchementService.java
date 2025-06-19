package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy.AccouchementRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;

@Service
public class AccouchementService {

    @Autowired
    private AccouchementRepository accouchementRepository;

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private EmployeRepository employeRepository;


    public List<Accouchement> getAll() {
        return accouchementRepository.findAll();
    }

    public Optional<Accouchement> getById(Long id) {
        return accouchementRepository.findById(id);
    }

    public List<Accouchement> getByDossierGrossesseId(Long dossierId) {
        return accouchementRepository.findByDossierGrossesseId(dossierId);
    }

//    public List<Accouchement> getBySageFemmeId(Long sageFemmeId) {
//        return accouchementRepository.findBySageFemmeId(sageFemmeId);
//    }

    public Accouchement create(Accouchement accouchement) {
        Long dossierId = accouchement.getDossierGrossesse().getId();
        Long employeId = accouchement.getEmploye().getId();

        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("employe non trouvée avec l'id: " + employeId));

        accouchement.setDossierGrossesse(dossier);
        accouchement.setEmploye(employe);


        return accouchementRepository.save(accouchement);
    }

    public Accouchement update(Long id, Accouchement updated) {
        if (!accouchementRepository.existsById(id)) {
            throw new RuntimeException("Accouchement non trouvé avec l'id: " + id);
        }

        Long dossierId = updated.getDossierGrossesse().getId();
        Long employeId = updated.getEmploye().getId();

        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("DossierGrossesse non trouvé avec l'id: " + dossierId));
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("SageFemme non trouvée avec l'id: " + employeId));


        updated.setId(id);
        updated.setDossierGrossesse(dossier);
        updated.setEmploye(employe);

        return accouchementRepository.save(updated);
    }

    public void delete(Long id) {
        accouchementRepository.deleteById(id);
    }
}