package com.gestion_hospitaliere.UeEntreprise.service.consultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.repository.consultationTraitement.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    @Autowired
    public ConsultationService(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }

    public Consultation saveConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        // Vérifier si la consultation existe avant de la mettre à jour
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée avec l'id : " + id));

        // Mettre à jour les champs nécessaires. Exemple :
        // consultation.setDateConsultation(consultationDetails.getDateConsultation());
        // consultation.setMotif(consultationDetails.getMotif());
        // ... autres champs ...

        // Pour cet exemple, nous allons simplement remplacer l'entité si elle est trouvée
        // et que consultationDetails a un ID (ou pas, save gère les deux cas)
        // Si vous voulez un vrai update partiel, il faut copier les propriétés.
        consultationDetails.setId(id); // Assurez-vous que l'ID est bien celui de l'entité à mettre à jour
        return consultationRepository.save(consultationDetails);
    }

    public void deleteConsultation(Long id) {
        if (!consultationRepository.existsById(id)) {
            throw new RuntimeException("Consultation non trouvée avec l'id : " + id + " pour la suppression.");
        }
        consultationRepository.deleteById(id);
    }
}