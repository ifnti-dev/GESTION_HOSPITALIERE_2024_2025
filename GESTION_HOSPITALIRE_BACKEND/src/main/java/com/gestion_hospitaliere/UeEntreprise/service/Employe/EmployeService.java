package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

@Service
public class EmployeService {

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * 🔹 Créer un employé à partir d'une personne existante ou nouvelle
     */
    @Transactional
    public Employe creerEmploye(Employe employe) {
        // Vérifie si la personne existe déjà
        if (employe.getPersonne() != null && employe.getPersonne().getId() != null) {
            Optional<Personne> existingPersonne = personneRepository.findById(employe.getPersonne().getId());
            if (existingPersonne.isPresent()) {
                employe.setPersonne(existingPersonne.get());
            } else {
                throw new IllegalArgumentException("Personne non trouvée avec l'ID : " + employe.getPersonne().getId());
            }
        } else {
            // Si aucune personne existante, on sauvegarde la nouvelle
            Personne nouvellePersonne = personneRepository.save(employe.getPersonne());
            employe.setPersonne(nouvellePersonne);
        }

        return employeRepository.save(employe);
    }

    /**
     * 🔹 Récupérer tous les employés
     */
    public List<Employe> recupererTousLesEmployes() {
        return employeRepository.findAll();
    }

    /**
     * 🔹 Récupérer un employé par ID
     */
    public Optional<Employe> obtenirEmployeParId(Long id) {
        return employeRepository.findById(id);
    }

    /**
     * 🔹 Mettre à jour les informations d’un employé
     */
    @Transactional
    public Employe mettreAJourEmploye(Long id, Employe updatedEmploye) {
        Employe existant = employeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun employé trouvé avec l'ID : " + id));

        existant.setHoraire(updatedEmploye.getHoraire());
        existant.setDateAffectation(updatedEmploye.getDateAffectation());
        existant.setSpecialite(updatedEmploye.getSpecialite());
        existant.setNumOrdre(updatedEmploye.getNumOrdre());

        // Mise à jour des rôles
        existant.setRoles(updatedEmploye.getRoles());

        return employeRepository.save(existant);
    }

    /**
     * 🔹 Supprimer un employé
     */
    public void supprimerEmploye(Long id) {
        if (!employeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employé inexistant avec l'ID : " + id);
        }
        employeRepository.deleteById(id);
    }

    /**
     * 🔹 Vérifier l'existence d’un employé
     */
    public boolean existeEmployeParId(Long id) {
        return employeRepository.existsById(id);
    }

    /**
     * 🔹 Ajouter un rôle à un employé
     */
    @Transactional
    public Employe ajouterRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().add(role);
        return employeRepository.save(employe);
    }

    /**
     * 🔹 Supprimer un rôle d’un employé
     */
    @Transactional
    public Employe retirerRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().remove(role);
        return employeRepository.save(employe);
    }

    /**
     * 🔹 Affecter une personne existante à un employé existant
     */
    @Transactional
    public Employe affecterPersonneAEmploye(Long employeId, Long personneId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new IllegalArgumentException("Personne introuvable"));

        employe.setPersonne(personne);
        return employeRepository.save(employe);
    }
}