package com.gestion_hospitaliere.UeEntreprise.service.Pregnancy;

import java.time.LocalDate;
import java.time.LocalTime;
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

    public Accouchement create(Accouchement accouchement) {
        // Validation des relations
        validateRelations(accouchement);
        
        // Validation des champs obligatoires
        validateRequiredFields(accouchement);
        
        // Validation des données bébé
        validateBabyData(accouchement);
        
        // Validation des données d'accouchement
        validateDeliveryData(accouchement);
        
        // Validation des APGAR
        validateApgarScores(accouchement);

        return accouchementRepository.save(accouchement);
    }

    public Accouchement update(Long id, Accouchement updated) {
        Accouchement existing = accouchementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accouchement non trouvé avec l'ID : " + id));

        // Validation des relations
        validateRelations(updated);
        
        // Validation des champs obligatoires
        validateRequiredFields(updated);
        
        // Validation des données bébé
        validateBabyData(updated);
        
        // Validation des données d'accouchement
        validateDeliveryData(updated);
        
        // Validation des APGAR
        validateApgarScores(updated);

        // Mise à jour des champs
        updateFields(existing, updated);

        return accouchementRepository.save(existing);
    }

    public void delete(Long id) {
        accouchementRepository.deleteById(id);
    }

    // Méthodes de validation
    private void validateRelations(Accouchement accouchement) {
        // Vérification du dossier de grossesse
        if (accouchement.getDossierGrossesse() == null || accouchement.getDossierGrossesse().getId() == null) {
            throw new IllegalArgumentException("Le dossier de grossesse est obligatoire.");
        }
        Long dossierId = accouchement.getDossierGrossesse().getId();
        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("Dossier de grossesse non trouvé avec l'ID : " + dossierId));
        accouchement.setDossierGrossesse(dossier);

        // Vérification de l'employé
        if (accouchement.getEmploye() == null || accouchement.getEmploye().getId() == null) {
            throw new IllegalArgumentException("L'employé en charge de l'accouchement est obligatoire.");
        }
        Long employeId = accouchement.getEmploye().getId();
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID : " + employeId));
        accouchement.setEmploye(employe);
    }

    private void validateRequiredFields(Accouchement accouchement) {
        // Validation date et heure
        if (accouchement.getDate() == null) {
            throw new IllegalArgumentException("La date de l'accouchement est requise.");
        }
        if (accouchement.getDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La date de l'accouchement ne peut pas être dans le futur.");
        }
        if (accouchement.getHeure() == null) {
            throw new IllegalArgumentException("L'heure de l'accouchement est requise.");
        }
        
        // Validation type d'accouchement
        if (accouchement.getTypeAccouchement() == null || accouchement.getTypeAccouchement().trim().isEmpty()) {
            throw new IllegalArgumentException("Le type d'accouchement est obligatoire.");
        }
        // List<String> validTypes = List.of("Naturel", "Césarienne", "Instrumental");
        // if (!validTypes.contains(accouchement.getTypeAccouchement())) {
        //     throw new IllegalArgumentException("Type d'accouchement invalide. Types valides : " + validTypes);
        // }
        
        // Validation lieu
        if (accouchement.getLieu() == null || accouchement.getLieu().trim().isEmpty()) {
            throw new IllegalArgumentException("Le lieu de l'accouchement est obligatoire.");
        }
    }

    private void validateBabyData(Accouchement accouchement) {
        // Validation poids
        if (accouchement.getPoids() == null || accouchement.getPoids() <= 0) {
            throw new IllegalArgumentException("Le poids du bébé doit être positif.");
        }
        
        // Validation sexe
        if (accouchement.getSexe() == null || 
            (!"M".equals(accouchement.getSexe()) && !"F".equals(accouchement.getSexe()))) {
            throw new IllegalArgumentException("Le sexe du bébé doit être 'M' ou 'F'.");
        }
        
        // Validation état vital
        if (accouchement.getVivant() == null && accouchement.getMortNe() == null) {
            throw new IllegalArgumentException("L'état vital du bébé doit être spécifié (vivant ou mort-né).");
        }
        if (accouchement.getVivant() != null && accouchement.getMortNe() != null && 
            accouchement.getVivant() && accouchement.getMortNe()) {
            throw new IllegalArgumentException("L'état vital du bébé ne peut pas être à la fois vivant et mort-né.");
        }
        
        // Validation terme
        if (accouchement.getATerme() == null && accouchement.getPremature() == null) {
            throw new IllegalArgumentException("Le terme du bébé doit être spécifié (à terme ou prématuré).");
        }
    }

    private void validateDeliveryData(Accouchement accouchement) {
        // Validation présentation
        if (accouchement.getPresentation() == null || accouchement.getPresentation().trim().isEmpty()) {
            throw new IllegalArgumentException("La présentation du bébé est obligatoire.");
        }
        
        // Validation type de délivrance
        if (accouchement.getTypeDelivrance() == null || accouchement.getTypeDelivrance().trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de délivrance est obligatoire.");
        }
    }

    private void validateApgarScores(Accouchement accouchement) {
        // Validation APGAR si bébé vivant
        if (Boolean.TRUE.equals(accouchement.getVivant())) {
            if (accouchement.getApgar1min() == null) {
                throw new IllegalArgumentException("Le score APGAR à 1 minute est obligatoire pour un bébé vivant.");
            }
            if (accouchement.getApgar1min() < 0 || accouchement.getApgar1min() > 10) {
                throw new IllegalArgumentException("Le score APGAR à 1 minute doit être entre 0 et 10.");
            }
            
            if (accouchement.getApgar5min() == null) {
                throw new IllegalArgumentException("Le score APGAR à 5 minutes est obligatoire pour un bébé vivant.");
            }
            if (accouchement.getApgar5min() < 0 || accouchement.getApgar5min() > 10) {
                throw new IllegalArgumentException("Le score APGAR à 5 minutes doit être entre 0 et 10.");
            }
        }
    }

    private void updateFields(Accouchement existing, Accouchement updated) {
        // Mise à jour des champs d'accouchement
        existing.setDate(updated.getDate());
        existing.setHeure(updated.getHeure());
        existing.setLieu(updated.getLieu());
        existing.setPresentation(updated.getPresentation());
        existing.setTypeAccouchement(updated.getTypeAccouchement());
        existing.setEtatPerinee(updated.getEtatPerinee());
        existing.setEtatVulve(updated.getEtatVulve());
        existing.setTypeDelivrance(updated.getTypeDelivrance());
        existing.setRevisionUterine(updated.getRevisionUterine());
        existing.setHemorragieGrave(updated.getHemorragieGrave());
        existing.setAllaitement30min(updated.getAllaitement30min());
        existing.setAllaitementApres30min(updated.getAllaitementApres30min());
        existing.setSuitesCouches(updated.getSuitesCouches());

        // Mise à jour des champs bébé
        existing.setATerme(updated.getATerme());
        existing.setPremature(updated.getPremature());
        existing.setVivant(updated.getVivant());
        existing.setCriantAussitot(updated.getCriantAussitot());
        existing.setMortNe(updated.getMortNe());
        existing.setReanime(updated.getReanime());
        existing.setDureeReanimation(updated.getDureeReanimation());
        existing.setReanimationEnVain(updated.getReanimationEnVain());
        existing.setApgar1min(updated.getApgar1min());
        existing.setApgar5min(updated.getApgar5min());
        existing.setApgar10min(updated.getApgar10min());
        existing.setTaille(updated.getTaille());
        existing.setPerimetreCranien(updated.getPerimetreCranien());
        existing.setSexe(updated.getSexe());
        existing.setPoids(updated.getPoids());
        existing.setDateBCG(updated.getDateBCG());
        existing.setDatePolio(updated.getDatePolio());

        // Mise à jour des relations
        existing.setDossierGrossesse(updated.getDossierGrossesse());
        existing.setEmploye(updated.getEmploye());
    }
}