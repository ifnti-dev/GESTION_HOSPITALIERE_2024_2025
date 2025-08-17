package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationPrenataleRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;

import java.util.List;

@Service
public class ConsultationPrenataleService {

    @Autowired
    private ConsultationPrenataleRepository consultationRepository;

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private EmployeRepository employeRepository;

    public List<ConsultationPrenatale> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public ConsultationPrenatale getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));
    }

    public ConsultationPrenatale createConsultation(ConsultationPrenatale consultation) {
    // Vérification de la présence de l'ID du dossier grossesse
    if (consultation.getDossierGrossesse() == null || consultation.getDossierGrossesse().getId() == null) {
        throw new IllegalArgumentException("L'ID du dossier de grossesse est obligatoire.");
    }

    // Vérification de la présence de l'ID de l'employé (médecin ou sage-femme)
    if (consultation.getEmploye() == null || consultation.getEmploye().getId() == null) {
        throw new IllegalArgumentException("L'ID de l'employé (médecin/sage-femme) est obligatoire.");
    }

    // Récupération et validation du dossier grossesse
    DossierGrossesse dossier = dossierGrossesseRepository.findById(consultation.getDossierGrossesse().getId())
        .orElseThrow(() -> new EntityNotFoundException(
            "Dossier de grossesse non trouvé avec l'ID : " + consultation.getDossierGrossesse().getId()
        ));
    consultation.setDossierGrossesse(dossier);

    // Récupération et validation de l'employé
    Employe employe = employeRepository.findById(consultation.getEmploye().getId())
        .orElseThrow(() -> new EntityNotFoundException(
            "Employé non trouvé avec l'ID : " + consultation.getEmploye().getId()
        ));
    consultation.setEmploye(employe);

    // Sauvegarde de la consultation prénatale
    return consultationRepository.save(consultation);
}


    public ConsultationPrenatale updateConsultation(Long id, ConsultationPrenatale details) {
        ConsultationPrenatale consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));

        // Mise à jour des champs
        consultation.setDateConsultation(details.getDateConsultation());
        consultation.setPoidsMere(details.getPoidsMere());
        consultation.setHauteurUterine(details.getHauteurUterine());
        consultation.setBruitsCoeurFoetal(details.getBruitsCoeurFoetal());
        consultation.setOedemes(details.getOedemes());
        consultation.setMouvementsFoetus(details.getMouvementsFoetus());

        consultation.setPresenceDiabeteGestationnel(details.getPresenceDiabeteGestationnel());
        consultation.setPresenceHypertensionGestationnelle(details.getPresenceHypertensionGestationnelle());

        consultation.setResultatsAnalyses(details.getResultatsAnalyses());
        consultation.setExamensComplementaires(details.getExamensComplementaires());

        consultation.setTraitementsEnCours(details.getTraitementsEnCours());
        consultation.setObservationsGenerales(details.getObservationsGenerales());
        consultation.setDecisionMedicale(details.getDecisionMedicale());
        consultation.setDateProchaineConsultation(details.getDateProchaineConsultation());

        consultation.setDerniereDoseVAT(details.getDerniereDoseVAT());
        consultation.setDateDerniereDoseVAT(details.getDateDerniereDoseVAT());

        // Mise à jour de l'employé
        if (details.getEmploye() != null && details.getEmploye().getId() != null) {
            Employe employe = employeRepository.findById(details.getEmploye().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé avec l'id : " + details.getEmploye().getId()));
            consultation.setEmploye(employe);
        }

        // Mise à jour du dossier de grossesse
        if (details.getDossierGrossesse() != null && details.getDossierGrossesse().getId() != null) {
            DossierGrossesse dossier = dossierGrossesseRepository.findById(details.getDossierGrossesse().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier de grossesse non trouvé avec l'id : " + details.getDossierGrossesse().getId()));
            consultation.setDossierGrossesse(dossier);
        }

        return consultationRepository.save(consultation);
    }

    @Transactional
    public void deleteConsultation(Long id) {
        ConsultationPrenatale consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));

        consultation.setDossierGrossesse(null);
        consultation.setEmploye(null);

        consultationRepository.delete(consultation);
    }
    public List<ConsultationPrenatale> getConsultationsByDossierGrossesseId(Long dossierGrossesseId) {
    return consultationRepository.findByDossierGrossesse_Id(dossierGrossesseId);
}
}
