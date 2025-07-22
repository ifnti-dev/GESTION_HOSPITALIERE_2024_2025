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
        System.out.println("=== SERVICE CRÉATION EMPLOYÉ ===");
        System.out.println("Employé reçu: " + employe);
        
        // Vérifier que l'employé a une personne associée
        Personne personneInput = employe.getPersonne();
        System.out.println("Personne associée: " + personneInput);   
        if (personneInput == null) {
            throw new IllegalArgumentException("Les détails personnels (Personne) sont requis pour créer un employé.");
        }

        Personne managedPersonne;
        
        // Si la personne a un ID, on la récupère de la base
        if (personneInput.getId() != null && personneInput.getId() > 0) {
            System.out.println("Recherche personne par ID: " + personneInput.getId());
            managedPersonne = personneRepository.findById(personneInput.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Personne non trouvée avec l'ID : " + personneInput.getId()));
            System.out.println("Personne trouvée: " + managedPersonne.getNom() + " " + managedPersonne.getPrenom());
        } 
        // Sinon, on vérifie par email pour éviter les doublons
        else if (personneInput.getEmail() != null && !personneInput.getEmail().trim().isEmpty()) {
            System.out.println("Recherche personne par email: " + personneInput.getEmail());
            Optional<Personne> personneParEmail = personneRepository.findByEmail(personneInput.getEmail());
            
            if (personneParEmail.isPresent()) {
                managedPersonne = personneParEmail.get();
                System.out.println("Personne existante trouvée par email: " + managedPersonne.getNom());
            } else {
                // Créer une nouvelle personne
                System.out.println("Création d'une nouvelle personne");
                if (personneInput.getNom() == null || personneInput.getNom().trim().isEmpty() ||
                    personneInput.getPrenom() == null || personneInput.getPrenom().trim().isEmpty()) {
                    throw new IllegalArgumentException("Nom et prénom sont requis pour créer une nouvelle personne.");
                }
                managedPersonne = personneRepository.save(personneInput);
                System.out.println("Nouvelle personne créée avec ID: " + managedPersonne.getId());
            }
        } else {
            throw new IllegalArgumentException("Email ou ID de personne requis pour créer un employé.");
        }

        // Vérifier que la personne n'est pas déjà employée
        if (managedPersonne.getEmploye() != null) {
            throw new IllegalArgumentException("Cette personne est déjà employée (ID employé: " + managedPersonne.getEmploye().getId() + ")");
        }

        // Associer la personne à l'employé
        employe.setPersonne(managedPersonne);
        
        // Gérer les rôles
        Set<Role> managedRoles = new HashSet<>();
        if (employe.getRoles() != null && !employe.getRoles().isEmpty()) {
            System.out.println("Traitement des rôles: " + employe.getRoles().size());
            for (Role roleDetails : employe.getRoles()) {
                if (roleDetails.getId() != null) {
                    Role managedRole = roleRepository.findById(roleDetails.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé avec l'ID : " + roleDetails.getId()));
                    managedRoles.add(managedRole);
                    System.out.println("Rôle ajouté: " + managedRole.getNom());
                } else if (roleDetails.getNom() != null) {
                    Role managedRole = roleRepository.findByNom(roleDetails.getNom())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé avec le nom : " + roleDetails.getNom()));
                    managedRoles.add(managedRole);
                    System.out.println("Rôle ajouté par nom: " + managedRole.getNom());
                }
            }
        }
        employe.setRoles(managedRoles);

        // Sauvegarder l'employé
        Employe savedEmploye = employeRepository.save(employe);
        System.out.println("Employé sauvegardé avec ID: " + savedEmploye.getId());
        
        // Mettre à jour la relation bidirectionnelle
        managedPersonne.setEmploye(savedEmploye);
        personneRepository.save(managedPersonne);
        
        return savedEmploye;
    }

    public List<Employe> recupererTousLesEmployes() {
        return employeRepository.findAll();
    }

    public Optional<Employe> obtenirEmployeParId(Long id) {
        return employeRepository.findById(id);
    }

    @Transactional
    public Employe mettreAJourEmploye(Long id, Employe updatedEmploye) {
        Employe existant = employeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun employé trouvé avec l'ID : " + id));

        // Mise à jour des champs de base
        if (updatedEmploye.getHoraire() != null) {
            existant.setHoraire(updatedEmploye.getHoraire());
        }
        if (updatedEmploye.getDateAffectation() != null) {
            existant.setDateAffectation(updatedEmploye.getDateAffectation());
        }
        if (updatedEmploye.getSpecialite() != null) {
            existant.setSpecialite(updatedEmploye.getSpecialite());
        }
        if (updatedEmploye.getNumOrdre() != null) {
            existant.setNumOrdre(updatedEmploye.getNumOrdre());
        }

        // Mise à jour des rôles si fournis
        if (updatedEmploye.getRoles() != null) {
            Set<Role> newManagedRoles = new HashSet<>();
            for (Role roleDetail : updatedEmploye.getRoles()) {
                if (roleDetail.getId() != null) {
                    Role managedRole = roleRepository.findById(roleDetail.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé pour mise à jour avec l'ID : " + roleDetail.getId()));
                    newManagedRoles.add(managedRole);
                } else if (roleDetail.getNom() != null) {
                    Role managedRole = roleRepository.findByNom(roleDetail.getNom())
                            .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé pour mise à jour avec le nom : " + roleDetail.getNom()));
                    newManagedRoles.add(managedRole);
                }
            }
            existant.setRoles(newManagedRoles);
        }

        return employeRepository.save(existant);
    }

    public void supprimerEmploye(Long id) {
        if (!employeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employé inexistant avec l'ID : " + id);
        }
        
        // Récupérer l'employé pour nettoyer la relation
        Optional<Employe> employeOpt = employeRepository.findById(id);
        if (employeOpt.isPresent()) {
            Employe employe = employeOpt.get();
            if (employe.getPersonne() != null) {
                employe.getPersonne().setEmploye(null);
                personneRepository.save(employe.getPersonne());
            }
        }
        
        employeRepository.deleteById(id);
    }

    public boolean existeEmployeParId(Long id) {
        return employeRepository.existsById(id);
    }

    @Transactional
    public Employe ajouterRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().add(role);
        return employeRepository.save(employe);
    }

    @Transactional
    public Employe retirerRoleAEmploye(Long employeId, Long roleId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable"));

        employe.getRoles().remove(role);
        return employeRepository.save(employe);
    }

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
}
