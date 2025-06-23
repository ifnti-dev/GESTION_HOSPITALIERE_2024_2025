package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.EmployeService;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.EmployeServicee;

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
    private PersonneRepository personneRepository;

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
        // Gérer l'association de la Personne (patient)
        Personne patientDetails = consultation.getPersonne();
        Personne managedPatient;
        if (patientDetails == null) {
            throw new IllegalArgumentException("Les détails du patient (personne) sont requis pour créer une consultation.");
        }

        if (patientDetails.getId() != null) {
            managedPatient = personneRepository.findById(patientDetails.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Patient (Personne) non trouvé avec l'ID : " + patientDetails.getId()));
        } else if (patientDetails.getEmail() != null) {
            managedPatient = personneRepository.findByEmail(patientDetails.getEmail())
                    .orElseGet(() -> personneRepository.save(patientDetails)); // Crée si non trouvé par email
        } else {
            // Si ni ID ni email, mais d'autres détails sont là, on crée une nouvelle personne
            if (patientDetails.getNom() == null || patientDetails.getPrenom() == null) { // Ajoutez d'autres vérifications si nécessaire
                 throw new IllegalArgumentException("Nom et prénom sont requis pour créer un nouveau patient.");
            }
            managedPatient = personneRepository.save(patientDetails);
        }
        consultation.setPersonne(managedPatient);

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
                        // Pour créer un employé via service, il faut que medecinDetails.getPersonne() soit rempli
                        if (medecinDetails.getPersonne() == null || medecinDetails.getPersonne().getNom() == null) {
                            throw new IllegalArgumentException("Les détails personnels (nom, prénom, email) du médecin sont requis pour le créer avec son numéro d'ordre.");
                        }
                        return employeService.creerEmploye(medecinDetails); // Utilise EmployeService pour créer
                    });
        } else {
            // Si ni ID ni numOrdre, mais l'objet medecinDetails et sa personne associée sont là
            if (medecinDetails.getPersonne() == null || medecinDetails.getPersonne().getNom() == null) {
                 throw new IllegalArgumentException("Les détails personnels complets du médecin sont requis pour le créer.");
            }
            managedMedecin = employeService.creerEmploye(medecinDetails); // Utilise EmployeService pour créer
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
        existingConsultation.setDiagnhttps://chatgpt.com/c/68592c1e-ee30-8005-8b0d-51fd69de098dostic(consultationDetails.getDiagnostic());

        // Mettre à jour l'employé associé si fourni
        if (consultationDetails.getEmploye() != null) {
            Employe medecinUpdateDetails = consultationDetails.getEmploye();
            Employe updatedMedecin;
            if (medecinUpdateDetails.getId() != null) {
                updatedMedecin = employeRepository.findById(medecinUpdateDetails.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin (Employe) non trouvé pour mise à jour avec l'ID : " + medecinUpdateDetails.getId()));
            } else if (medecinUpdateDetails.getNumOrdre() != null) { // Logique de recherche/création si pas d'ID
                updatedMedecin = employeRepository.findByNumOrdre(medecinUpdateDetails.getNumOrdre())
                        .orElseThrow(() -> new IllegalArgumentException("Médecin non trouvé par NumOrdre: " + medecinUpdateDetails.getNumOrdre() + ". La création à la volée lors de l'update n'est pas gérée ici, fournissez un ID ou un numOrdre existant."));
                // Ou implémenter une logique de création/mise à jour plus complexe si nécessaire
            } else {
                throw new IllegalArgumentException("ID ou Numéro d'Ordre de l'employé requis pour mettre à jour l'association.");
            }
            existingConsultation.setEmploye(updatedMedecin);
        }

        // Mettre à jour la personne (patient) associée si fournie
        if (consultationDetails.getPersonne() != null) {
            Personne patientUpdateDetails = consultationDetails.getPersonne();
            Personne updatedPatient;
            if (patientUpdateDetails.getId() != null) {
                updatedPatient = personneRepository.findById(patientUpdateDetails.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Patient (Personne) non trouvé pour mise à jour avec l'ID : " + patientUpdateDetails.getId()));
            } else if (patientUpdateDetails.getEmail() != null) { // Logique de recherche si pas d'ID
                 updatedPatient = personneRepository.findByEmail(patientUpdateDetails.getEmail())
                        .orElseThrow(() -> new IllegalArgumentException("Patient non trouvé par email: " + patientUpdateDetails.getEmail() + ". La création à la volée lors de l'update n'est pas gérée ici, fournissez un ID ou un email existant."));
            } else {
                throw new IllegalArgumentException("ID ou Email de la personne (patient) requis pour mettre à jour l'association.");
            }
            existingConsultation.setPersonne(updatedPatient);
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

    public List<Consultation> getConsultationsByPersonneId(Long personneId) {
        return consultationRepository.findByPersonne_Id(personneId);
    }

    public List<Consultation> getConsultationsByDiagnosticContaining(String keyword) {
        return consultationRepository.findByDiagnosticContaining(keyword);
    }
}
