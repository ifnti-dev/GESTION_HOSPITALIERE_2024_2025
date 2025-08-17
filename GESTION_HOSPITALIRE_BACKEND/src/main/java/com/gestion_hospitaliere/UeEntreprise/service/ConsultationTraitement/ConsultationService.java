package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierMedicalRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
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
        // Gestion du dossier médical
        DossierMedical dossier = consultation.getDossierMedical();
        if (dossier == null || dossier.getId() == null) {
            throw new IllegalArgumentException("L'ID du dossier médical est requis pour la consultation.");
        }

        DossierMedical managedDossier = dossierMedicalRepository.findById(dossier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Dossier médical non trouvé avec l'ID : " + dossier.getId()));
        consultation.setDossierMedical(managedDossier);

        // Gestion du médecin (employé)
        Employe employe = consultation.getEmploye();
        if (employe == null) {
            throw new IllegalArgumentException("Les informations du médecin sont requises.");
        }

        Employe managedEmploye;
        if (employe.getId() != null) {
            managedEmploye = employeRepository.findById(employe.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Médecin non trouvé avec l'ID : " + employe.getId()));
        } else if (employe.getNumOrdre() != null) {
            managedEmploye = employeRepository.findByNumOrdre(employe.getNumOrdre())
                    .orElseGet(() -> {
                        if (employe.getPersonne() == null || employe.getPersonne().getNom() == null) {
                            throw new IllegalArgumentException("Détails personnels requis pour créer un nouveau médecin.");
                        }
                        return employeService.creerEmploye(employe);
                    });
        } else {
            if (employe.getPersonne() == null || employe.getPersonne().getNom() == null) {
                throw new IllegalArgumentException("Détails personnels complets requis pour le médecin.");
            }
            managedEmploye = employeService.creerEmploye(employe);
        }
        consultation.setEmploye(managedEmploye);

        // Lier prescriptions à la consultation
        if (consultation.getPrescriptions() != null) {
            for (Prescription prescription : consultation.getPrescriptions()) {
                prescription.setConsultation(consultation);
            }
        }

        return consultationRepository.save(consultation);
    }

    @Transactional
    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        Consultation existing = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée avec l'id : " + id));

        existing.setDate(consultationDetails.getDate());
        existing.setSymptomes(consultationDetails.getSymptomes());
        existing.setDiagnostic(consultationDetails.getDiagnostic());

        // Mise à jour du médecin
        if (consultationDetails.getEmploye() != null) {
            Employe employe = consultationDetails.getEmploye();
            Employe updated;
            if (employe.getId() != null) {
                updated = employeRepository.findById(employe.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin non trouvé avec l'ID : " + employe.getId()));
            } else if (employe.getNumOrdre() != null) {
                updated = employeRepository.findByNumOrdre(employe.getNumOrdre())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin non trouvé avec le numéro d'ordre : " + employe.getNumOrdre()));
            } else {
                throw new IllegalArgumentException("ID ou numéro d'ordre requis pour le médecin.");
            }
            existing.setEmploye(updated);
        }

        // Mise à jour du dossier médical
        if (consultationDetails.getDossierMedical() != null) {
            DossierMedical dossier = consultationDetails.getDossierMedical();
            if (dossier.getId() == null) {
                throw new IllegalArgumentException("ID du dossier requis pour mise à jour.");
            }
            DossierMedical updatedDossier = dossierMedicalRepository.findById(dossier.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Dossier médical non trouvé avec l'ID : " + dossier.getId()));
            existing.setDossierMedical(updatedDossier);
        }

        // Mise à jour des prescriptions
        if (consultationDetails.getPrescriptions() != null) {
            existing.getPrescriptions().clear();
            for (Prescription pres : consultationDetails.getPrescriptions()) {
                pres.setConsultation(existing);
                existing.getPrescriptions().add(pres);
            }
        }

        return consultationRepository.save(existing);
    }

    @Transactional
    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation non trouvée pour l'id : " + id);
        }
        consultationRepository.deleteById(id);
    }

    // Recherches personnalisées
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
