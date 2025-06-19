package com.gestion_hospitaliere.UeEntreprise.service.Appointments;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.Appointments.RendezVousRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private  PersonneRepository personneRepository;

    @Autowired
    private EmployeRepository employeRepository;

    

    public List<RendezVous> getAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    public RendezVous getRendezVousById(Long id) {
        return rendezVousRepository.findById(id).orElse(null);
    }

    public RendezVous createRendezVous(RendezVous rendezVous) {
    // ✅ Vérifier que la personne et son ID sont présents
    if (rendezVous.getPersonne() == null ) {
        System.out.println("Personne dans le rendez-vous : " + rendezVous.getPersonne());

        throw new IllegalArgumentException("L'ID de la personne est requis pour créer un rendez-vous.");
    }

    Long personneId = rendezVous.getPersonne().getId();
    Personne personne = personneRepository.findById(personneId)
        .orElseThrow(() -> new RuntimeException("Personne non trouvée avec l'id : " + personneId));
    rendezVous.setPersonne(personne);

    // ✅ Vérifier si un employé (médecin) est fourni, et valider son ID
    if (rendezVous.getEmploye() != null) {
        if (rendezVous.getEmploye().getId() == null) {
            throw new IllegalArgumentException("L'ID de l'employé est requis s'il est fourni.");
        }

        Long employeId = rendezVous.getEmploye().getId();
        Employe employe = employeRepository.findById(employeId)
            .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + employeId));
        rendezVous.setEmploye(employe);
    }

    // ✅ Tu peux ajouter ici la validation de la sage-femme si besoin

    return rendezVousRepository.save(rendezVous);
}


    public RendezVous updateRendezVous(Long id, RendezVous updatedRendezVous) {
        if (!rendezVousRepository.existsById(id)) {
            return null;
        }

        updatedRendezVous.setId(id);

        // Récupérer et valider le personne
        Long personneId = updatedRendezVous.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
            .orElseThrow(() -> new RuntimeException("personne non trouvé avec l'id : " + personneId));
        updatedRendezVous.setPersonne(personne);

        // Récupérer et valider le médecin s'il est fourni
        if (updatedRendezVous.getEmploye() != null) {
            Long employeId = updatedRendezVous.getEmploye().getId();
            Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + employeId));
            updatedRendezVous.setEmploye(employe);
        }

        // Récupérer et valider la sage-femme si elle est fournie
       


        return rendezVousRepository.save(updatedRendezVous);
    }

    public void deleteRendezVous(Long id) {
        rendezVousRepository.deleteById(id);
    }

    public List<RendezVous> findByStatut(String statut) {
        return rendezVousRepository.findByStatut(statut);
    }

    public List<RendezVous> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return rendezVousRepository.findByDateHeureBetween(startDate, endDate);
    }
}
