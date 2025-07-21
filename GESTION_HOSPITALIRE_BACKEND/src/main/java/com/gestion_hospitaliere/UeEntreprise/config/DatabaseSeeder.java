package com.gestion_hospitaliere.UeEntreprise.config;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PermissionRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;


@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    @Override
    public void run(String... args) throws Exception {

        // Nettoyage des données existantes
        // roleRepository.deleteAll();
        // permissionRepository.deleteAll();
        // personneRepository.deleteAll();
        // employeRepository.deleteAll();

        // Création des données de test
        final String adminEmail = "admin@admin.com";
        final String adminPassword = "admin123";
        String encodedPassword = passwordEncoder.encode(adminPassword);


       // Insertion des permissions
       if (permissionRepository.count() == 0) {
            List<Permission> permissions = Arrays.asList(
                new Permission("CREATE_USER", "Autorise la création d'un utilisateur"),
                new Permission("READ_USER", "Autorise la lecture des informations utilisateur"),
                new Permission("UPDATE_USER", "Autorise la modification des informations utilisateur"),
                new Permission("DELETE_USER", "Autorise la suppression d'un utilisateur"),
                new Permission("MANAGE_ROLES", "Autorise la gestion des rôles et des permissions"),
                new Permission("CREATE_RDV", "Planifier un rendez-vous"),
                new Permission("UPDATE_RDV", "Modifier un rendez-vous"),
                new Permission("DELETE_RDV", "Supprimer un rendez-vous"),
                new Permission("VIEW_RDV", "Consulter les rendez-vous"),
                new Permission("VALIDATE_RDV", "Valider un rendez-vous"),
                new Permission("REGISTER_EMPLOYE", "Enregistrer un employé"),
                new Permission("UPDATE_EMPLOYE", "Modifier un employé"),
                new Permission("DELETE_EMPLOYE", "Supprimer un employé"),
                new Permission("VIEW_EMPLOYE", "Consulter les employés"),
                new Permission("AFFECT_ROLE_EMPLOYE", "Affecter un rôle à un employé"),
                new Permission("CREATE_PATIENT", "Créer un patient"),
                new Permission("EDIT_PATIENT", "Modifier les informations d'un patient"),
                new Permission("DELETE_PATIENT", "Supprimer un patient"),
                new Permission("VIEW_DOSSIER_MEDICAL", "Consulter le dossier médical"),
                new Permission("UPDATE_DOSSIER_GROSSESSE", "Modifier un dossier de grossesse"),
                new Permission("ADD_MEDICAMENT", "Ajouter un médicament"),
                new Permission("UPDATE_MEDICAMENT", "Mettre à jour un médicament"),
                new Permission("DELETE_MEDICAMENT", "Supprimer un médicament"),
                new Permission("VIEW_STOCK", "Consulter le stock de médicaments"),
                new Permission("GERER_APPROVISIONNEMENT", "Gérer les approvisionnements"),
                new Permission("CREER_CONSULTATION", "Créer une consultation"),
                new Permission("MODIFIER_CONSULTATION", "Modifier une consultation"),
                new Permission("SUPPRIMER_CONSULTATION", "Supprimer une consultation"),
                new Permission("PRESCRIRE_MEDICAMENT", "Prescrire un médicament"),
                new Permission("SUIVRE_ETAT", "Suivre l’état du patient"),
                new Permission("ADMETTRE_PATIENT", "Admettre un patient"),
                new Permission("MODIFIER_HOSPITALISATION", "Modifier une hospitalisation"),
                new Permission("LIBERER_LIT", "Libérer un lit"),
                new Permission("GERER_SERVICE_HOPITAL", "Gérer les services d’hôpital"),
                new Permission("CONSULTER_HOSPITALISATION", "Consulter les hospitalisations"),
                new Permission("CREER_FACTURE", "Créer une facture"),
                new Permission("MODIFIER_FACTURE", "Modifier une facture"),
                new Permission("VALIDER_PAIEMENT", "Valider un paiement"),
                new Permission("GERER_CAISSE", "Gérer la caisse"),
                new Permission("CONSULTER_PAIEMENTS", "Voir les paiements"),
                new Permission("ENREGISTRER_ACC_PMT", "Enregistrer un accouchement"),
                new Permission("SUIVI_GROSSESSE", "Effectuer le suivi de grossesse"),
                new Permission("MODIFIER_SUIVI_GROSSESSE", "Modifier le suivi de grossesse"),
                new Permission("SUPPRIMER_ACC_PMT", "Supprimer un enregistrement d’accouchement"),
                new Permission("VOIR_GROSSESSE_PATIENT", "Voir les grossesses du patient")
            );

            permissionRepository.saveAll(permissions);
        }

        // Insertion des rôles
        if (roleRepository.count() == 0) {
            // Créez d'abord les permissions pour l'admin
            HashSet<Permission> adminPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                1L, 2L, 3L, 4L, 5L, 7L, 8L, 9L, 10L, 11L, 12L, 13L, 14L, 15L, 16L, 
                17L, 18L, 19L, 20L, 21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L, 29L, 30L, 
                31L, 32L, 33L, 34L, 35L, 36L, 37L, 38L, 39L, 40L, 41L, 42L, 43L, 44L, 45L
            )));
            Role adminRole = new Role();
            adminRole.setNom("ADMIN");
            adminRole.setPermissions(adminPermissions);
            roleRepository.save(adminRole);


            // Créez les permissions pour le directeur
            Set<Permission> directeurPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                1L, 2L, 3L, 5L, 7L, 8L, 10L, 11L, 12L, 13L, 15L, 16L, 17L, 18L, 20L, 21L, 22L, 23L, 
                25L, 26L, 27L, 28L, 30L, 31L, 32L, 33L, 35L, 36L, 37L, 38L, 39L, 40L, 41L, 42L, 43L,
                 44L)));

            Role directeurRole = new Role();
            directeurRole.setNom("DIRECTEUR");
            directeurRole.setPermissions(directeurPermissions);
            roleRepository.save(directeurRole);


            // Créez les permissions pour l'infirmier
            Set<Permission> infirmierPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                7L, 8L, 9L, 10L, 31L, 32L, 33L, 34L, 36L
            )));

            Role infirmierRole = new Role();
            infirmierRole.setNom("INFIRMIER");
            infirmierRole.setPermissions(infirmierPermissions);
            roleRepository.save(infirmierRole);


            // Créez les permissions pour caissier
            Set<Permission> caissierPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                37L, 38L, 39L, 40L, 41L
            )));

            Role caissierRole = new Role();
            caissierRole.setNom("CAISSIER");
            caissierRole.setPermissions(caissierPermissions);
            roleRepository.save(caissierRole); 


            // Créez les permissions pour le pharmacien
            Set<Permission> pharmacienPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                22L, 23L, 24L, 25L, 26L
            )));

            Role pharmacienRole = new Role();
            pharmacienRole.setNom("PHARMACIEN");
            pharmacienRole.setPermissions(pharmacienPermissions);
            roleRepository.save(pharmacienRole);


            // Créez les permissions pour la sage-femme
            Set<Permission> sageFemmePermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                42L, 43L, 44L, 45L, 21L
            )));

            Role sageFemmeRole = new Role();
            sageFemmeRole.setNom("SAGE_FEMME");
            sageFemmeRole.setPermissions(sageFemmePermissions);
            roleRepository.save(sageFemmeRole);




            // Créez les permissions pour le médecin
            Set<Permission> medecinPermissions = new HashSet<>(permissionRepository.findAllById(List.of(
                27L, 28L, 29L, 30L, 20L, 17L, 18L, 19L)));

            Role medecinRole = new Role();
            medecinRole.setNom("MEDECIN");
            medecinRole.setPermissions(medecinPermissions);
            roleRepository.save(medecinRole);
        }

        // Insertion des utilisateurs
        if (personneRepository.count() == 0) {
            // Créez un utilisateur admin
            Personne admin = new Personne();
            admin.setNom("TOYI");
            admin.setPrenom("François");
            admin.setEmail(adminEmail);
            admin.setPassword(encodedPassword);
            admin.setSexe("M");
            admin.setTelephone("90330819");
            admin.setDateNaissance(LocalDate.of(2000, 1, 1));
            admin.setSituationMatrimoniale("célibataire");
            personneRepository.save(admin);

            Employe adminEmploye = new Employe();
            adminEmploye.setPersonne(admin);
            adminEmploye.setHoraire("9h-17h");
            adminEmploye.setSpecialite("Administration");
            adminEmploye.setNumOrdre("ADM123456");
            adminEmploye.setDateAffectation(new java.util.Date());
            adminEmploye.setRoles(new HashSet<>(List.of(roleRepository.findByNom("DIRECTEUR").orElseThrow(() -> new RuntimeException("Role ADMIN not found")))));
            employeRepository.save(adminEmploye);
        }
    }
}