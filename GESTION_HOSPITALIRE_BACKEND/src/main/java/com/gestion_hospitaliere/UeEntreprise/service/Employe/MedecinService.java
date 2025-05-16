package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.MedecinRepository;

@Service
public class MedecinService {

    @Autowired
    private MedecinRepository medecinRepository;

    // Ajouter un médecin
    public Medecin ajouterMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    // Récupérer tous les médecins
    public List<Medecin> obtenirTousLesMedecins() {
        return medecinRepository.findAll();
    }

    // Récupérer un médecin par ID
    public Optional<Medecin> obtenirMedecinParId(Long id) {
        return medecinRepository.findById(id);
    }

    // Mettre à jour un médecin
    public Medecin mettreAJourMedecin(Long id, Medecin medecinDetails) {
        Optional<Medecin> medecinOptional = medecinRepository.findById(id);
        if (medecinOptional.isPresent()) {
            Medecin medecin = medecinOptional.get();

            // ✅ Mise à jour des champs hérités de Utilisateur
            medecin.setNomUtilisateur(medecinDetails.getNomUtilisateur());
            medecin.setPassword(medecinDetails.getPassword());
            medecin.setNom(medecinDetails.getNom());
            medecin.setPrenom(medecinDetails.getPrenom());
            medecin.setEmail(medecinDetails.getEmail());
            medecin.setRoles(medecinDetails.getRoles());

            // ✅ Mise à jour des champs spécifiques à Médecin
            medecin.setSpecialite(medecinDetails.getSpecialite());
            medecin.setHorairesTravail(medecinDetails.getHorairesTravail());
            medecin.setDateDebutAffectation(medecinDetails.getDateDebutAffectation());
            medecin.setActif(medecinDetails.getActif());
            medecin.setService(medecinDetails.getService());

            return medecinRepository.save(medecin);
        } else {
            throw new RuntimeException("Médecin non trouvé avec l'ID : " + id);
        }
    }



    // public Medecin mettreAJourMedecin(Long id, Medecin medecinDetails) {
    //     Optional<Medecin> medecinOptional = medecinRepository.findById(id);
    //     if (medecinOptional.isPresent()) {
    //         Medecin medecin = medecinOptional.get();
    //         // Mise à jour des champs spécifiques
    //         medecin.setSpecialite(medecinDetails.getSpecialite());
    //         medecin.setHorairesTravail(medecinDetails.getHorairesTravail());
    //         medecin.setDateDebutAffectation(medecinDetails.getDateDebutAffectation());
    //         medecin.setActif(medecinDetails.getActif());
    //         medecin.setService(medecinDetails.getService());
    //         return medecinRepository.save(medecin);
    //     } else {
    //         throw new RuntimeException("Médecin non trouvé avec l'ID : " + id);
    //     }
    // }

    // Supprimer un médecin
    public void supprimerMedecin(Long id) {
        medecinRepository.deleteById(id);
    }

    // Récupérer les médecins actifs
    public List<Medecin> obtenirMedecinsActifs() {
        return medecinRepository.findAll().stream()
                .filter(Medecin::getActif)
                .toList();
    }

    // Récupérer les médecins par spécialité
    public List<Medecin> obtenirMedecinsParSpecialite(String specialite) {
        return medecinRepository.findAll().stream()
                .filter(medecin -> specialite.equalsIgnoreCase(medecin.getSpecialite()))
                .toList();
    }

    // Récupérer les médecins par service
    public List<Medecin> obtenirMedecinsParService(Long serviceId) {
        return medecinRepository.findAll().stream()
                .filter(medecin -> medecin.getService() != null && medecin.getService().getId().equals(serviceId))
                .toList();
    }
}