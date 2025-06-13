package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

@Service
public class DossierGrossesseService {

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private PersonneRepository personneRepository;

    public List<DossierGrossesse> getAll() {
        return dossierGrossesseRepository.findAll();
    }

    public Optional<DossierGrossesse> getById(Long id) {
        return dossierGrossesseRepository.findById(id);
    }

    public Optional<DossierGrossesse> getByPatientId(Long personneId) {
        return dossierGrossesseRepository.findByPersonneId(personneId);
    }

    public DossierGrossesse create(DossierGrossesse dossier) {
        Long personneId = dossier.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + personneId));
        dossier.setPersonne(personne);
        return dossierGrossesseRepository.save(dossier);
    }

    public DossierGrossesse update(Long id, DossierGrossesse updated) {
        if (!dossierGrossesseRepository.existsById(id)) {
            throw new RuntimeException("DossierGrossesse non trouvé avec l'id: " + id);
        }
        Long personneId = updated.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + personneId));
        updated.setId(id);
        updated.setPersonne(personne);
        return dossierGrossesseRepository.save(updated);
    }

    public void delete(Long id) {
        dossierGrossesseRepository.deleteById(id);
    }
}