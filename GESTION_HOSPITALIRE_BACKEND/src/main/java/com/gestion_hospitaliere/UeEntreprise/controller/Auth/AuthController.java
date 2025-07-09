package com.gestion_hospitaliere.UeEntreprise.controller.Auth;

import com.gestion_hospitaliere.UeEntreprise.config.JwtUtil;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.dto.AuthRequest;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmployeRepository employeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            System.out.println("=== DEBUT LOGIN ===");
            System.out.println("AuthRequest reçu: " + authRequest);
            
            String email = authRequest.getEmail();
            String password = authRequest.getPassword();
            
            System.out.println("Email: " + email);
            System.out.println("Password présent: " + (password != null && !password.isEmpty()));

            // Validation des données d'entrée
            if (email == null || email.trim().isEmpty()) {
                System.err.println("Email manquant ou vide");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email requis"));
            }

            if (password == null || password.trim().isEmpty()) {
                System.err.println("Mot de passe manquant ou vide");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mot de passe requis"));
            }

            // Authentification avec Spring Security
            System.out.println("Tentative d'authentification...");
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email.trim(), password)
            );

            System.out.println("Authentification réussie pour: " + email);

            // Génération du token JWT
            String token = jwtUtil.generateToken(email.trim());
            System.out.println("Token généré avec succès");

            // Réponse de succès
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Connexion réussie");
            response.put("email", email.trim());

            System.out.println("=== FIN LOGIN REUSSI ===");
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.err.println("Identifiants invalides pour: " + authRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Identifiants invalides"));
                
        } catch (Exception e) {
            System.err.println("Erreur lors de la connexion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur interne du serveur"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            System.out.println("=== DEBUT GET PROFILE ===");
            
            // Récupérer l'utilisateur authentifié
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.err.println("Utilisateur non authentifié");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Non authentifié"));
            }

            String email = authentication.getName();
            System.out.println("Récupération du profil pour: " + email);

            // Rechercher l'employé par email avec ses rôles
            Optional<Employe> employeOpt = employeRepository.findByPersonneEmailWithRoles(email);
            
            if (employeOpt.isEmpty()) {
                System.err.println("Employé non trouvé pour l'email: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Profil utilisateur non trouvé"));
            }

            Employe employe = employeOpt.get();
            Personne personne = employe.getPersonne();

            // Construire la réponse avec toutes les informations
            Map<String, Object> profileData = new HashMap<>();
            
            // Informations personnelles
            profileData.put("id", personne.getId());
            profileData.put("nom", personne.getNom());
            profileData.put("prenom", personne.getPrenom());
            profileData.put("email", personne.getEmail());
            profileData.put("telephone", personne.getTelephone());
            profileData.put("adresse", personne.getAdresse());
            profileData.put("dateNaissance", personne.getDateNaissance());
            profileData.put("sexe", personne.getSexe());
            profileData.put("situationMatrimoniale", personne.getSituationMatrimoniale());

            // Informations professionnelles
            Map<String, Object> employeData = new HashMap<>();
            employeData.put("id", employe.getId());
            employeData.put("numOrdre", employe.getNumOrdre());
            employeData.put("specialite", employe.getSpecialite());
            employeData.put("dateAffectation", employe.getDateAffectation());
            employeData.put("horaire", employe.getHoraire());

            // Rôles et permissions
            List<Map<String, Object>> roles = employe.getRoles().stream()
                .map(role -> {
                    Map<String, Object> roleMap = new HashMap<>();
                    roleMap.put("id", role.getId());
                    roleMap.put("nom", role.getNom());
//                    roleMap.put("description", role.getDescription());
                    
                    List<Map<String, Object>> permissions = role.getPermissions().stream()
                        .map(permission -> {
                            Map<String, Object> permMap = new HashMap<>();
                            permMap.put("id", permission.getId());
                            permMap.put("nom", permission.getNom());
                            permMap.put("description", permission.getDescription());
                            return permMap;
                        })
                        .collect(Collectors.toList());
                    
                    roleMap.put("permissions", permissions);
                    return roleMap;
                })
                .collect(Collectors.toList());

            employeData.put("roles", roles);
            profileData.put("employe", employeData);

            System.out.println("Profil récupéré avec succès pour: " + email);
            System.out.println("=== FIN GET PROFILE REUSSI ===");
            
            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération du profil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la récupération du profil"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
        } catch (Exception e) {
            System.err.println("Erreur lors de la déconnexion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la déconnexion"));
        }
    }
}
