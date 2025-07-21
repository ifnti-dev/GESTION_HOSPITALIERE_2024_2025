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
        // Association du dossierGrossesse
        Long dossierId = consultation.getDossierGrossesse().getId();
        DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
            .orElseThrow(() -> new EntityNotFoundException("DossierGrossesse non trouvé avec l'id : " + dossierId));
        consultation.setDossierGrossesse(dossier);

        // Association du médecin (employe)
        Long employeId = consultation.getEmploye().getId();
        Employe employe = employeRepository.findById(employeId)
            .orElseThrow(() -> new EntityNotFoundException("Employe (médecin) non trouvé avec l'id : " + employeId));
        consultation.setEmploye(employe);

        return consultationRepository.save(consultation);
    }

    public ConsultationPrenatale updateConsultation(Long id, ConsultationPrenatale consultationDetails) {
        ConsultationPrenatale consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));

        consultation.setDateConsultation(consultationDetails.getDateConsultation());
        consultation.setSemaineAmenorrhee(consultationDetails.getSemaineAmenorrhee());
        consultation.setPoids(consultationDetails.getPoids());
        consultation.setTensionArterielle(consultationDetails.getTensionArterielle());
        consultation.setHauteurUterine(consultationDetails.getHauteurUterine());
        consultation.setBruitsCardiaquesFoetaux(consultationDetails.getBruitsCardiaquesFoetaux());
        consultation.setObservations(consultationDetails.getObservations());
        consultation.setProchainRdv(consultationDetails.getProchainRdv());
        consultation.setAlerte(consultationDetails.getAlerte());

        // Mise à jour du dossierGrossesse si fourni
        if (consultationDetails.getDossierGrossesse() != null) {
            Long dossierId = consultationDetails.getDossierGrossesse().getId();
            DossierGrossesse dossier = dossierGrossesseRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("DossierGrossesse non trouvé avec l'id : " + dossierId));
            consultation.setDossierGrossesse(dossier);
        }

        // Mise à jour du médecin (employe) si fourni
        if (consultationDetails.getEmploye() != null) {
            Long employeId = consultationDetails.getEmploye().getId();
            Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new EntityNotFoundException("Employe (médecin) non trouvé avec l'id : " + employeId));
            consultation.setEmploye(employe);
        }

        return consultationRepository.save(consultation);
    }

    @Transactional
    public void deleteConsultation(Long id) {
        ConsultationPrenatale consultation = consultationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));

        // Détacher le dossierGrossesse et l'employe associés
        consultation.setDossierGrossesse(null);
        consultation.setEmploye(null);

        // Supprimer la consultation
        consultationRepository.delete(consultation);
    }
}
