package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.model.dto.EmployeParRoleDTO;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

import jakarta.validation.Valid;

@Service
@Validated
public class EmployeService {

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    public Employe creerEmploye(@Valid Employe employe) {
        // 1. Validation de base
        if (employe == null || employe.getPersonne() == null) {
            throw new IllegalArgumentException("Les informations personne et employé sont requises");
        }
        
        if (employe.getNumOrdre() != null && employeRepository.existsByNumOrdre(employe.getNumOrdre())) {
            throw new IllegalArgumentException("Le numéro d'ordre existe déjà");
        }

        // 2. Gestion de la Personne
        Personne managedPersonne = gererPersonne(employe.getPersonne());
        
        // 3. Vérification employé existant
        if (managedPersonne.getEmploye() != null) {
            throw new IllegalStateException("La personne est déjà un employé existant");
        }

        // 4. Gestion des rôles
        Set<Role> roles = gererRoles(employe.getRoles());
        
        // 5. Construction de l'Employe
        Employe employeACreer = new Employe();
        employeACreer.setPersonne(managedPersonne);
        employeACreer.setRoles(roles);
        employeACreer.setHoraire(employe.getHoraire());
        employeACreer.setSpecialite(employe.getSpecialite());
        employeACreer.setNumOrdre(employe.getNumOrdre());
        employeACreer.setDateAffectation(employe.getDateAffectation());

        // 6. Sauvegarde
        Employe employeCree = employeRepository.save(employeACreer);
        
        // 7. Mise à jour relation bidirectionnelle
        managedPersonne.setEmploye(employeCree);
        personneRepository.save(managedPersonne);

        return employeCree;
    }

    private Personne gererPersonne(@Valid Personne personneInput) {
        // 1. Si ID existe, récupération
        if (personneInput.getId() != null) {
            return personneRepository.findById(personneInput.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Personne non trouvée"));
        }

        // 2. Vérification par email
        if (personneInput.getEmail() != null) {
            return personneRepository.findByEmail(personneInput.getEmail())
                    .orElseGet(() -> creerNouvellePersonne(personneInput));
        }

        throw new IllegalArgumentException("Email ou ID requis");
    }

    private Personne creerNouvellePersonne(@Valid Personne personne) {
        if (personne.getNom() == null || personne.getPrenom() == null) {
            throw new IllegalArgumentException("Nom et prénom requis");
        }
        return personneRepository.save(personne);
    }

    private Set<Role> gererRoles(Set<Role> rolesInput) {
        if (rolesInput == null || rolesInput.isEmpty()) {
            return new HashSet<>();
        }

        return rolesInput.stream()
                .map(role -> {
                    if (role.getId() != null) {
                        return roleRepository.findById(role.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));
                    } else if (role.getNom() != null) {
                        return roleRepository.findByNom(role.getNom())
                                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));
                    }
                    throw new IllegalArgumentException("Rôle invalide");
                })
                .collect(Collectors.toSet());
    }
    
    // Récupérer tous les employés
    public List<Employe> recupererTousLesEmployes() {
        return employeRepository.findAll();
    }

    public Optional<Employe> obtenirEmployeParId(Long id) {
        return employeRepository.findById(id);
    }

    @Transactional
    public Employe mettreAJourEmploye(Long id, @Valid Employe updatedEmploye) {
        if (updatedEmploye == null) {
            throw new IllegalArgumentException("Les données de mise à jour ne peuvent pas être nulles");
        }

        Employe existant = employeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun employé trouvé avec l'ID : " + id));

        // Validation du numéro d'ordre s'il est fourni
        if (updatedEmploye.getNumOrdre() != null && !updatedEmploye.getNumOrdre().equals(existant.getNumOrdre())) {
            if (employeRepository.existsByNumOrdre(updatedEmploye.getNumOrdre())) {
                throw new IllegalArgumentException("Le numéro d'ordre est déjà utilisé par un autre employé");
            }
            existant.setNumOrdre(updatedEmploye.getNumOrdre());
        }

        // Mise à jour des champs de base avec Optional pour éviter les if null
        Optional.ofNullable(updatedEmploye.getHoraire()).ifPresent(existant::setHoraire);
        Optional.ofNullable(updatedEmploye.getDateAffectation()).ifPresent(existant::setDateAffectation);
        Optional.ofNullable(updatedEmploye.getSpecialite()).ifPresent(existant::setSpecialite);

        // Mise à jour des rôles si fournis (version optimisée avec stream)
        if (updatedEmploye.getRoles() != null) {
            Set<Role> managedRoles = updatedEmploye.getRoles().stream()
                    .map(role -> {
                        if (role.getId() != null) {
                            return roleRepository.findById(role.getId())
                                    .orElseThrow(() -> new IllegalArgumentException(
                                        "Rôle non trouvé pour mise à jour avec l'ID : " + role.getId()));
                        } else if (role.getNom() != null) {
                            return roleRepository.findByNom(role.getNom())
                                    .orElseThrow(() -> new IllegalArgumentException(
                                        "Rôle non trouvé pour mise à jour avec le nom : " + role.getNom()));
                        }
                        throw new IllegalArgumentException("Rôle invalide - ID ou nom requis");
                    })
                    .collect(Collectors.toSet());
            
            existant.setRoles(managedRoles);
        }

        // Pas besoin d'appeler save explicitement grâce au contexte de persistance
        return existant;
    }

    // Supprimer un employé
    @Transactional
    public void supprimerEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employé inexistant avec l'ID : " + id));
        
        if (employe.getPersonne() != null) {
            employe.getPersonne().setEmploye(null);
            personneRepository.save(employe.getPersonne());
        }
        
        employeRepository.delete(employe);
    }
    

    // Vérifier si un employé existe par ID
    public boolean existeEmployeParId(Long id) {
        return employeRepository.existsById(id);
    }

    // Ajouter un rôle à un employé
    @Transactional
    public Employe ajouterRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().add(role);
        return employeRepository.save(employe);
    }

    // Retirer un rôle d'un employé
    @Transactional
    public Employe retirerRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().remove(role);
        return employeRepository.save(employe);
    }

    // Affecter une personne à un employé
    @Transactional
    public Employe affecterPersonneAEmploye(Long employeId, Long personneId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new IllegalArgumentException("Personne introuvable"));

        // Vérifier que la personne n'est pas déjà employée
        if (personne.getEmploye() != null && !personne.getEmploye().getId().equals(employeId)) {
            throw new IllegalArgumentException("Cette personne est déjà employée");
        }

        // Gérer la relation bidirectionnelle
        employe.setPersonne(personne);
        personne.setEmploye(employe);
        
        return employeRepository.save(employe);
    }


    // Nombre d'employés par rôle
    public List<Object[]> getNombreEmployesParRole() {
        return employeRepository.countEmployesByRoleNative();
    }
}
