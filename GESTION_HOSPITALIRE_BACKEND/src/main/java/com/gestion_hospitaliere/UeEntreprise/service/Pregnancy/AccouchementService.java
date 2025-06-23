package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.time.LocalDate;
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
    // --- Vérification du dossier de grossesse ---
    if (accouchement.getDossierGrossesse() == null || accouchement.getDossierGrossesse().getId() == null) {
        throw new IllegalArgumentException("Le dossier de grossesse est obligatoire.");
    }
    Long dossierId = accouchement.getDossierGrossesse().getId();
    DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
            .orElseThrow(() -> new RuntimeException("Dossier de grossesse non trouvé avec l'ID : " + dossierId));

    // --- Vérification de l'employé ---
    if (accouchement.getEmploye() == null || accouchement.getEmploye().getId() == null) {
        throw new IllegalArgumentException("L'employé en charge de l'accouchement est obligatoire.");
    }
    Long employeId = accouchement.getEmploye().getId();
    Employe employe = employeRepository.findById(employeId)
            .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID : " + employeId));

    // --- Vérification de la date ---
    if (accouchement.getDate() == null) {
        throw new IllegalArgumentException("La date de l'accouchement est requise.");
    }
    if (accouchement.getDate().isAfter(LocalDate.now())) {
        throw new IllegalArgumentException("La date de l'accouchement ne peut pas être dans le futur.");
    }

    // --- Vérification du type d'accouchement ---
    if (accouchement.getType() == null || accouchement.getType().trim().isEmpty()) {
        throw new IllegalArgumentException("Le type d'accouchement est obligatoire.");
    }
    List<String> typesValidés = List.of("Naturel", "Césarienne", "Instrumental");
    if (!typesValidés.contains(accouchement.getType())) {
        throw new IllegalArgumentException("Type d'accouchement invalide. Types valides : " + typesValidés);
    }

    // --- Vérification du poids du bébé ---
    if (accouchement.getBebePoids() == null || accouchement.getBebePoids() <= 0) {
        throw new IllegalArgumentException("Le poids du bébé doit être positif.");
    }

    // --- Enregistrement final ---
    accouchement.setDossierGrossesse(dossier);
    accouchement.setEmploye(employe);

    return accouchementRepository.save(accouchement);
}


    public Accouchement update(Long id, Accouchement updated) {
    // --- Vérification de l'existence de l'accouchement ---
    Accouchement existing = accouchementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Accouchement non trouvé avec l'ID : " + id));

    // --- Vérification du dossier de grossesse ---
    if (updated.getDossierGrossesse() == null || updated.getDossierGrossesse().getId() == null) {
        throw new IllegalArgumentException("Le dossier de grossesse est obligatoire.");
    }
    Long dossierId = updated.getDossierGrossesse().getId();
    DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
            .orElseThrow(() -> new RuntimeException("Dossier de grossesse non trouvé avec l'ID : " + dossierId));

    // --- Vérification de l'employé ---
    if (updated.getEmploye() == null || updated.getEmploye().getId() == null) {
        throw new IllegalArgumentException("L'employé est obligatoire.");
    }
    Long employeId = updated.getEmploye().getId();
    Employe employe = employeRepository.findById(employeId)
            .orElseThrow(() -> new RuntimeException("Sage-femme non trouvée avec l'ID : " + employeId));

    // --- Vérification de la date ---
    if (updated.getDate() == null) {
        throw new IllegalArgumentException("La date de l'accouchement est requise.");
    }
    if (updated.getDate().isAfter(LocalDate.now())) {
        throw new IllegalArgumentException("La date de l'accouchement ne peut pas être dans le futur.");
    }

    // --- Vérification du type ---
    if (updated.getType() == null || updated.getType().trim().isEmpty()) {
        throw new IllegalArgumentException("Le type d'accouchement est obligatoire.");
    }
    List<String> typesValidés = List.of("Naturel", "Césarienne", "Instrumental");
    if (!typesValidés.contains(updated.getType())) {
        throw new IllegalArgumentException("Type d'accouchement invalide. Types valides : " + typesValidés);
    }

    // --- Vérification du poids du bébé ---
    if (updated.getBebePoids() == null || updated.getBebePoids() <= 0) {
        throw new IllegalArgumentException("Le poids du bébé doit être strictement positif.");
    }

    // --- Mise à jour des champs ---
    existing.setDate(updated.getDate());
    existing.setType(updated.getType());
    existing.setComplications(updated.getComplications());
    existing.setBebePoids(updated.getBebePoids());
    existing.setDossierGrossesse(dossier);
    existing.setEmploye(employe);

    return accouchementRepository.save(existing);
}


    public void delete(Long id) {
        accouchementRepository.deleteById(id);
    }
}