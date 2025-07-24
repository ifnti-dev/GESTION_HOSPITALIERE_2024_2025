package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Dossier;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierMedicalRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.service.User.EmployeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    private EmployeService employeService;

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }

    @Transactional
    public Consultation saveConsultation(Consultation consultation) {
        // Gérer l'association du DossierMedical
        DossierMedical dossierDetails = consultation.getDossierMedical();
        DossierMedical managedDossier;
        if (dossierDetails == null) {
            throw new IllegalArgumentException("Les détails du dossier médical sont requis pour créer une consultation.");
        }

        if (dossierDetails.getId() != null) {
            managedDossier = dossierMedicalRepository.findById(dossierDetails.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Dossier médical non trouvé avec l'ID : " + dossierDetails.getId()));
        } else {
            throw new IllegalArgumentException("L'ID du dossier médical est requis pour associer à une consultation.");
        }
        consultation.setDossierMedical(managedDossier);

        // Gérer l'association de l'Employe (médecin)
        Employe medecinDetails = consultation.getEmploye();
        Employe managedMedecin;
        if (medecinDetails == null) {
            throw new IllegalArgumentException("Les détails du médecin (employe) sont requis pour créer une consultation.");
        }

        if (medecinDetails.getId() != null) {
            managedMedecin = employeRepository.findById(medecinDetails.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Médecin (Employe) non trouvé avec l'ID : " + medecinDetails.getId()));
        } else if (medecinDetails.getNumOrdre() != null) {
            managedMedecin = employeRepository.findByNumOrdre(medecinDetails.getNumOrdre())
                    .orElseGet(() -> {
                        if (medecinDetails.getPersonne() == null || medecinDetails.getPersonne().getNom() == null) {
                            throw new IllegalArgumentException("Les détails personnels (nom, prénom, email) du médecin sont requis pour le créer avec son numéro d'ordre.");
                        }
                        return employeService.creerEmploye(medecinDetails);
                    });
        } else {
            if (medecinDetails.getPersonne() == null || medecinDetails.getPersonne().getNom() == null) {
                throw new IllegalArgumentException("Les détails personnels complets du médecin sont requis pour le créer.");
            }
            managedMedecin = employeService.creerEmploye(medecinDetails);
        }
        consultation.setEmploye(managedMedecin);

        // Gérer les prescriptions
        if (consultation.getPrescriptions() != null) {
            for (Prescription prescription : consultation.getPrescriptions()) {
                prescription.setConsultation(consultation);
            }
        }
        return consultationRepository.save(consultation);
    }

    @Transactional
    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        Consultation existingConsultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée avec l'id : " + id));
        existingConsultation.setDate(consultationDetails.getDate());
        existingConsultation.setSymptomes(consultationDetails.getSymptomes());

        // Mettre à jour l'employé associé si fourni
        if (consultationDetails.getEmploye() != null) {
            Employe medecinUpdateDetails = consultationDetails.getEmploye();
            Employe updatedMedecin;
            if (medecinUpdateDetails.getId() != null) {
                updatedMedecin = employeRepository.findById(medecinUpdateDetails.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin (Employe) non trouvé pour mise à jour avec l'ID : " + medecinUpdateDetails.getId()));
            } else if (medecinUpdateDetails.getNumOrdre() != null) {
                updatedMedecin = employeRepository.findByNumOrdre(medecinUpdateDetails.getNumOrdre())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin non trouvé par NumOrdre: " + medecinUpdateDetails.getNumOrdre() + ". La création à la volée lors de l'update n'est pas gérée ici, fournissez un ID ou un numOrdre existant."));
            } else {
                throw new IllegalArgumentException("ID ou Numéro d'Ordre de l'employé requis pour mettre à jour l'association.");
            }
            existingConsultation.setEmploye(updatedMedecin);
        }

        // Mettre à jour le dossier médical associé si fourni
        if (consultationDetails.getDossierMedical() != null) {
            DossierMedical dossierUpdateDetails = consultationDetails.getDossierMedical();
            DossierMedical updatedDossier;
            if (dossierUpdateDetails.getId() != null) {
                updatedDossier = dossierMedicalRepository.findById(dossierUpdateDetails.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Dossier médical non trouvé pour mise à jour avec l'ID : " + dossierUpdateDetails.getId()));
            } else {
                throw new IllegalArgumentException("ID du dossier médical requis pour mettre à jour l'association.");
            }
            existingConsultation.setDossierMedical(updatedDossier);
        }

        // Gérer la mise à jour des prescriptions
        if (consultationDetails.getPrescriptions() != null) {
            existingConsultation.getPrescriptions().clear();
            for (Prescription prescriptionDetail : consultationDetails.getPrescriptions()) {
                prescriptionDetail.setConsultation(existingConsultation);
                existingConsultation.getPrescriptions().add(prescriptionDetail);
            }
        }
        return consultationRepository.save(existingConsultation);
    }

    @Transactional
    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation non trouvée avec l'id : " + id + " pour la suppression.");
        }
        consultationRepository.deleteById(id);
    }

    // Méthodes pour utiliser les requêtes personnalisées du repository

    public List<Consultation> getConsultationsByDate(LocalDate date) {
        return consultationRepository.findByDate(date);
    }

    public List<Consultation> getConsultationsByDossierMedicalId(Long dossierMedicalId) {
        return consultationRepository.findByDossierMedical_Id(dossierMedicalId);
    }

    public List<Consultation> getConsultationsByDiagnosticContaining(String keyword) {
        return consultationRepository.findByDiagnosticContaining(keyword);
    }
}
