package com.gestion_hospitaliere.UeEntreprise.config;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;
import com.gestion_hospitaliere.UeEntreprise.service.User.EmployeService;
import com.gestion_hospitaliere.UeEntreprise.service.User.PersonneService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private final PersonneService personneService;
    private final EmployeService employeService;
    private final PersonneRepository personneRepository;
    private final RoleRepository roleRepository;

    public AdminAccountInitializer(PersonneService personneService, EmployeService employeService, PersonneRepository personneRepository, RoleRepository roleRepository) {
        this.personneService = personneService;
        this.employeService = employeService;
        this.personneRepository = personneRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        final String adminEmail = "admin@admin.com";
        final String adminPassword = "123"; // Dans une application réelle, utilisez des variables d'environnement ou des méthodes plus sécurisées
        final String adminRoleName = "directeur";

        System.out.println("Vérification du compte administrateur...");

        Optional<Personne> existingAdminPersonne = personneRepository.findByEmail(adminEmail);

        if (existingAdminPersonne.isEmpty()) {
            System.out.println("Compte administrateur non trouvé. Création d'un nouvel administrateur...");

            // 1. Créer la Personne
            Personne adminPersonne = new Personne();
            adminPersonne.setNom("Admin");
            adminPersonne.setPrenom("System");
            adminPersonne.setEmail(adminEmail);
            adminPersonne.setAdresse("komah");
            adminPersonne.setTelephone("0123456789");
            adminPersonne.setSexe("M");
            adminPersonne.setDateNaissance("01/01/1980");
            adminPersonne.setSituationMatrimoniale("Célibataire");
            adminPersonne.setPassword(adminPassword); // Le mot de passe sera encodé par PersonneService

            Personne savedPersonne = personneService.ajouterPersonne(adminPersonne);
            System.out.println("Personne Admin créée avec l'ID : " + savedPersonne.getId());

            // 2. Trouver ou Créer le Rôle Directeur
            Role directeurRole = roleRepository.findByNom(adminRoleName)
                    .orElseGet(() -> {
                        System.out.println("Rôle 'Directeur' non trouvé. Création...");
                        Role newRole = new Role();
                        newRole.setNom(adminRoleName);
                        newRole.setPermissions(Collections.emptySet()); // Aucune permission initialement
                        return roleRepository.save(newRole);
                    });
            System.out.println("ID du rôle 'Directeur' : " + directeurRole.getId());

            // 3. Créer l'Employé et lui assigner le Rôle
            Employe adminEmploye = new Employe();
            adminEmploye.setPersonne(savedPersonne);
            adminEmploye.setHoraire("9h-17h");
            adminEmploye.setSpecialite("Administration");
            adminEmploye.setNumOrdre("ADM001");
            adminEmploye.setDateAffectation(new java.util.Date()); // Date actuelle

            Set<Role> roles = new HashSet<>();
            roles.add(directeurRole);
            adminEmploye.setRoles(roles);

            Employe savedEmploye = employeService.creerEmploye(adminEmploye);
            System.out.println("Employé Admin créé avec l'ID : " + savedEmploye.getId());

            System.out.println("Compte administrateur créé avec succès !");
        } else {
            System.out.println("Le compte administrateur existe déjà.");
        }
    }
}
