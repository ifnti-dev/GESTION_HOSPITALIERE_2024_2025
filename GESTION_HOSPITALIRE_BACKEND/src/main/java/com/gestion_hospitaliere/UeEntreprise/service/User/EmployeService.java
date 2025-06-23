package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
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

 
    @Transactional
    public Employe creerEmploye(Employe employe) {
        // Gérer la Personne associée à l'Employe
        Personne personneInput = employe.getPersonne();
        if (personneInput == null) {
            throw new IllegalArgumentException("Les détails personnels (Personne) sont requis pour créer un employé.");
        }

        Personne managedPersonne;
        if (personneInput.getId() != null) {
            managedPersonne = personneRepository.findById(personneInput.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Personne non trouvée avec l'ID : " + personneInput.getId()));
        } else if (personneInput.getEmail() != null) {
            // Optionnel: rechercher par email pour éviter les doublons de Personne
            Optional<Personne> personneParEmail = personneRepository.findByEmail(personneInput.getEmail());
            if (personneParEmail.isPresent()) {
                managedPersonne = personneParEmail.get();
            } else {
                // Assurer que les champs requis pour une nouvelle personne sont là
                if (personneInput.getNom() == null || personneInput.getPrenom() == null) {
                    throw new IllegalArgumentException("Nom et prénom sont requis pour créer une nouvelle personne (via email non trouvé).");
                }
                managedPersonne = personneRepository.save(personneInput);
            }
        } else {
            // Si ni ID ni email, on sauvegarde la nouvelle personne (assurez-vous que les champs requis sont là)
            if (personneInput.getNom() == null || personneInput.getPrenom() == null) {
                throw new IllegalArgumentException("Nom et prénom sont requis pour créer une nouvelle personne associée à l'employé.");
            }
            managedPersonne = personneRepository.save(personneInput);
        }

        employe.setPersonne(managedPersonne);
        // Assurer la liaison bidirectionnelle avant de sauvegarder l'employé
        if (managedPersonne.getEmploye() == null) {
            managedPersonne.setEmploye(employe);
        }

        // Gérer les Rôles associés à l'Employe
        Set<Role> managedRoles = new HashSet<>();
        if (employe.getRoles() != null) {
            for (Role roleDetails : employe.getRoles()) {
                if (roleDetails.getId() != null) {
                    Role managedRole = roleRepository.findById(roleDetails.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé avec l'ID : " + roleDetails.getId()));
                    managedRoles.add(managedRole);
                } else if (roleDetails.getNom() != null) {
                    // Supposant que RoleRepository a findByNom et que Role a un champ 'nom'
                    Role managedRole = roleRepository.findByNom(roleDetails.getNom())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé avec le nom : " + roleDetails.getNom() + ". Veuillez fournir un ID de rôle valide ou un nom de rôle existant."));
                    managedRoles.add(managedRole);
                } else {
                    throw new IllegalArgumentException("Détails de rôle incomplets : ID ou nom du rôle requis.");
                }
            }
        }
        employe.setRoles(managedRoles);
        Employe savedEmploye = employeRepository.save(employe);
        return savedEmploye;
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

        // Mise à jour des rôles de manière plus robuste
        if (updatedEmploye.getRoles() != null) {
            Set<Role> newManagedRoles = new HashSet<>();
            for (Role roleDetail : updatedEmploye.getRoles()) {
                if (roleDetail.getId() != null) {
                    Role managedRole = roleRepository.findById(roleDetail.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé pour mise à jour avec l'ID : " + roleDetail.getId()));
                    newManagedRoles.add(managedRole);
                } else if (roleDetail.getNom() != null) { 
                    // Supposant que RoleRepository a findByNom et que Role a un champ 'nom'
                    Role managedRole = roleRepository.findByNom(roleDetail.getNom())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé pour mise à jour avec le nom : " + roleDetail.getNom()));
                    newManagedRoles.add(managedRole);
                } else {
                     throw new IllegalArgumentException("Détails de rôle incomplets pour la mise à jour : ID ou nom du rôle requis.");
                }
            }
            existant.setRoles(newManagedRoles);
        } else {
            // Si updatedEmploye.getRoles() est null, cela effacera les rôles existants.
            // Si vous souhaitez ne pas modifier les rôles dans ce cas, commentez la ligne suivante.
            existant.setRoles(new HashSet<>());
        }

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

        // Gérer la relation bidirectionnelle
        employe.setPersonne(personne);
        if (personne.getEmploye() != null && !personne.getEmploye().equals(employe)) {
            // Gérer le cas où la personne est déjà associée à un autre employé si nécessaire
        }
        personne.setEmploye(employe);
        return employeRepository.save(employe);
    }
}