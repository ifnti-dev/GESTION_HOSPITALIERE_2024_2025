package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationPrenataleRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

import java.util.List;

@Service
public class ConsultationPrenataleService {

    @Autowired
    private ConsultationPrenataleRepository consultationRepository;

    @Autowired
    private PersonneRepository personneRepository;

    public List<ConsultationPrenatale> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public ConsultationPrenatale getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));
    }

    public ConsultationPrenatale createConsultation(ConsultationPrenatale consultation) {
    Long patienteId = consultation.getPatiente().getId();
    System.out.println("Patiente ID: " + patienteId);
    
    Personne patiente = personneRepository.findById(patienteId)
        .orElseThrow(() -> new EntityNotFoundException("Patiente non trouvée avec l'id : " + patienteId));
    
    consultation.setPatiente(patiente);
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

        return consultationRepository.save(consultation);
    }

   
    @Transactional
public void deleteConsultation(Long id) {
    ConsultationPrenatale consultation = consultationRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Consultation non trouvée avec l'id : " + id));

    // Détacher la personne associée
    consultation.setPatiente(null);

    // Supprimer la consultation
    consultationRepository.delete(consultation);
}
}
