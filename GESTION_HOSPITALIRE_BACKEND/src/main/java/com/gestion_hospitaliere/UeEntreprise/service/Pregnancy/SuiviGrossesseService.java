package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.repository.Pregnancy.SuiviGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;

@Service
public class SuiviGrossesseService {

    @Autowired
    private SuiviGrossesseRepository suiviGrossesseRepository;

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private EmployeRepository employeRepository;

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
    // --- Vérification du dossier de grossesse ---
    if (suivi.getDossierGrossesse() == null || suivi.getDossierGrossesse().getId() == null) {
        throw new IllegalArgumentException("Le dossier de grossesse est obligatoire.");
    }

    Long dossierId = suivi.getDossierGrossesse().getId();
    DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
            .orElseThrow(() -> new RuntimeException("Dossier de grossesse non trouvé avec l'id: " + dossierId));
    suivi.setDossierGrossesse(dossier);

    // --- Vérification de l'employé (facultatif mais contrôlé) ---
    if (suivi.getEmploye() != null && suivi.getEmploye().getId() != null) {
        Long employeId = suivi.getEmploye().getId();
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + employeId));
        suivi.setEmploye(employe);
    }

    // --- Contrôle du trimestre ---
    if (suivi.getTrimestre() == null || suivi.getTrimestre().trim().isEmpty()) {
        throw new IllegalArgumentException("Le trimestre est obligatoire.");
    }
    List<String> trimestresValides = List.of("1er", "2ème", "3ème");
    if (!trimestresValides.contains(suivi.getTrimestre())) {
        throw new IllegalArgumentException("Trimestre invalide. Les valeurs valides sont : " + trimestresValides);
    }

    // --- Contrôle de la tension ---
    if (suivi.getTension() != null && (suivi.getTension() <= 0 || suivi.getTension() > 25)) {
        throw new IllegalArgumentException("Valeur de tension invalide. Elle doit être comprise entre 1 et 25.");
    }

    // --- Contrôle du poids ---
    if (suivi.getPoids() != null && suivi.getPoids() <= 0) {
        throw new IllegalArgumentException("Le poids doit être strictement positif.");
    }

    // --- Remarque facultative, aucun contrôle nécessaire ---

    return suiviGrossesseRepository.save(suivi);
}

public SuiviGrossesse update(Long id, SuiviGrossesse updated) {
    // --- Vérification de l'existence du suivi ---
    if (!suiviGrossesseRepository.existsById(id)) {
        throw new RuntimeException("Suivi de grossesse non trouvé avec l'id: " + id);
    }

    // --- Vérification du dossier de grossesse ---
    if (updated.getDossierGrossesse() == null || updated.getDossierGrossesse().getId() == null) {
        throw new IllegalArgumentException("Le dossier de grossesse est obligatoire.");
    }

    Long dossierId = updated.getDossierGrossesse().getId();
    DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
            .orElseThrow(() -> new RuntimeException("Dossier de grossesse non trouvé avec l'id: " + dossierId));
    updated.setDossierGrossesse(dossier);

    // --- Vérification de l'employé (si fourni) ---
    if (updated.getEmploye() != null && updated.getEmploye().getId() != null) {
        Long employeId = updated.getEmploye().getId();
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + employeId));
        updated.setEmploye(employe);
    }

    // --- Contrôle du trimestre ---
    if (updated.getTrimestre() == null || updated.getTrimestre().trim().isEmpty()) {
        throw new IllegalArgumentException("Le trimestre est obligatoire.");
    }

    List<String> trimestresValides = List.of("1er", "2ème", "3ème");
    if (!trimestresValides.contains(updated.getTrimestre())) {
        throw new IllegalArgumentException("Trimestre invalide. Les valeurs valides sont : " + trimestresValides);
    }

    // --- Contrôle de la tension ---
    if (updated.getTension() != null && (updated.getTension() <= 0 || updated.getTension() > 25)) {
        throw new IllegalArgumentException("Valeur de tension invalide. Elle doit être comprise entre 1 et 25.");
    }

    // --- Contrôle du poids ---
    if (updated.getPoids() != null && updated.getPoids() <= 0) {
        throw new IllegalArgumentException("Le poids doit être strictement positif.");
    }

    // --- Affecter l'ID existant ---
    updated.setId(id);

    return suiviGrossesseRepository.save(updated);
}


    public void delete(Long id) {
        suiviGrossesseRepository.deleteById(id);
    }
}
