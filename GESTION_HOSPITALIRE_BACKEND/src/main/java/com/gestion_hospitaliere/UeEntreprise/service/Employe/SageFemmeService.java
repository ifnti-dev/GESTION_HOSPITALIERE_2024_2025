package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.SageFemmeRepository;

@Service
public class SageFemmeService {

    @Autowired
    private SageFemmeRepository sageFemmeRepository;

    // Ajouter une sage-femme
    public SageFemme ajouterSageFemme(SageFemme sageFemme) {
        return sageFemmeRepository.save(sageFemme);
    }

    // Récupérer toutes les sages-femmes
    public List<SageFemme> obtenirToutesLesSagesFemmes() {
        return sageFemmeRepository.findAll();
    }

    // Récupérer une sage-femme par ID
    public Optional<SageFemme> obtenirSageFemmeParId(Long id) {
        return sageFemmeRepository.findById(id);
    }

    // Mettre à jour une sage-femme
    public SageFemme mettreAJourSageFemme(Long id, SageFemme sageFemmeDetails) {
        Optional<SageFemme> sageFemmeOptional = sageFemmeRepository.findById(id);
        if (sageFemmeOptional.isPresent()) {
            SageFemme sageFemme = sageFemmeOptional.get();

            // ✅ Mise à jour des champs hérités de Utilisateur
            sageFemme.setNomUtilisateur(sageFemmeDetails.getNomUtilisateur());
            sageFemme.setPassword(sageFemmeDetails.getPassword());
            sageFemme.setNom(sageFemmeDetails.getNom());
            sageFemme.setPrenom(sageFemmeDetails.getPrenom());
            sageFemme.setEmail(sageFemmeDetails.getEmail());
            sageFemme.setRoles(sageFemmeDetails.getRoles());

            // ✅ Mise à jour des champs spécifiques à SageFemme
            sageFemme.setSpecialite(sageFemmeDetails.getSpecialite());
            sageFemme.setHorairesTravail(sageFemmeDetails.getHorairesTravail());
            sageFemme.setDateDebutAffectation(sageFemmeDetails.getDateDebutAffectation());
            sageFemme.setActif(sageFemmeDetails.getActif());
            sageFemme.setService(sageFemmeDetails.getService());

            return sageFemmeRepository.save(sageFemme);
        } else {
            throw new RuntimeException("Sage-femme non trouvée avec l'ID : " + id);
        }
    }

    // public SageFemme mettreAJourSageFemme(Long id, SageFemme sageFemmeDetails) {
    //     Optional<SageFemme> sageFemmeOptional = sageFemmeRepository.findById(id);
    //     if (sageFemmeOptional.isPresent()) {
    //         SageFemme sageFemme = sageFemmeOptional.get();
    //         // Mise à jour des champs spécifiques
    //         sageFemme.setSpecialite(sageFemmeDetails.getSpecialite());
    //         sageFemme.setHorairesTravail(sageFemmeDetails.getHorairesTravail());
    //         sageFemme.setDateDebutAffectation(sageFemmeDetails.getDateDebutAffectation());
    //         sageFemme.setActif(sageFemmeDetails.getActif());
    //         sageFemme.setService(sageFemmeDetails.getService());
    //         return sageFemmeRepository.save(sageFemme);
    //     } else {
    //         throw new RuntimeException("Sage-femme non trouvée avec l'ID : " + id);
    //     }
    // }

    // Supprimer une sage-femme
    public void supprimerSageFemme(Long id) {
        sageFemmeRepository.deleteById(id);
    }

    // Récupérer les sages-femmes actives
    public List<SageFemme> obtenirSagesFemmesActives() {
        return sageFemmeRepository.findAll().stream()
                .filter(SageFemme::getActif)
                .toList();
    }

    // Récupérer les sages-femmes par spécialité
    public List<SageFemme> obtenirSagesFemmesParSpecialite(String specialite) {
        return sageFemmeRepository.findAll().stream()
                .filter(sageFemme -> specialite.equalsIgnoreCase(sageFemme.getSpecialite()))
                .toList();
    }

    // Récupérer les sages-femmes par service
    public List<SageFemme> obtenirSagesFemmesParService(Long serviceId) {
        return sageFemmeRepository.findAll().stream()
                .filter(sageFemme -> sageFemme.getService() != null && sageFemme.getService().getId().equals(serviceId))
                .toList();
    }
}