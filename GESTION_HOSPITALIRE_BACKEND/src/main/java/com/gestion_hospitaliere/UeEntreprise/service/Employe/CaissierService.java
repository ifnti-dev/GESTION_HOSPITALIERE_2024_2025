package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.CaissierRepository;

@Service
public class CaissierService {

    @Autowired
    private CaissierRepository caissierRepository;

    // Ajouter un nouveau caissier avec id de caisse
    // public Caissier ajouterCaissier(Caissier caissier) {
    //     if (caissier.getHorairesTravail() == null || caissier.getHorairesTravail().isEmpty()) {
    //         throw new IllegalArgumentException("Les horaires de travail ne peuvent pas être vides.");
    //     }

    //     // Remplacer les caisses détachées par les entités gérées
    //     if (caissier.getCaisses() != null) {
    //         List<Caisse> caissesManaged = new ArrayList<>();
    //         for (Caisse caisse : caissier.getCaisses()) {
    //             Caisse managed = caisseRepository.findById(caisse.getId())
    //                 .orElseThrow(() -> new IllegalArgumentException("Caisse non trouvée avec l'ID : " + caisse.getId()));
    //             caissesManaged.add(managed);
    //         }
    //         caissier.setCaisses(caissesManaged);
    //     }

    //     return caissierRepository.save(caissier);
    // }
    public Caissier ajouterCaissier(Caissier caissier) {
        if (caissier.getHorairesTravail() == null || caissier.getHorairesTravail().isEmpty()) {
            throw new IllegalArgumentException("Les horaires de travail ne peuvent pas être vides.");
        }
        return caissierRepository.save(caissier);
    }

    // Récupérer tous les caissiers
    public List<Caissier> obtenirTousLesCaissiers() {
        return caissierRepository.findAll();
    }

    // Récupérer un caissier par son ID
    public Optional<Caissier> obtenirCaissierParId(Long id) {
        return caissierRepository.findById(id);
    }

    // Mettre à jour un caissier
    public Caissier mettreAJourCaissier(Long id, Caissier caissierDetails) {
        return caissierRepository.findById(id).map(caissier -> {
            // Champs hérités de Utilisateur
            caissier.setNomUtilisateur(caissierDetails.getNomUtilisateur());
            caissier.setPassword(caissierDetails.getPassword());
            caissier.setNom(caissierDetails.getNom());
            caissier.setPrenom(caissierDetails.getPrenom());
            caissier.setEmail(caissierDetails.getEmail());
            caissier.setRoles(caissierDetails.getRoles());

            // Champs spécifiques à Caissier
            caissier.setDateDebutAffectation(caissierDetails.getDateDebutAffectation());
            caissier.setHorairesTravail(caissierDetails.getHorairesTravail());
            caissier.setActif(caissierDetails.getActif());
            caissier.setCaisses(caissierDetails.getCaisses());

            return caissierRepository.save(caissier);
        }).orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'ID : " + id));
    }

    // public Caissier mettreAJourCaissier(Long id, Caissier caissierDetails) {
    //     return caissierRepository.findById(id).map(caissier -> {
    //         caissier.setDateDebutAffectation(caissierDetails.getDateDebutAffectation());
    //         caissier.setHorairesTravail(caissierDetails.getHorairesTravail());
    //         caissier.setActif(caissierDetails.getActif());
    //         caissier.setCaisses(caissierDetails.getCaisses());
    //         return caissierRepository.save(caissier);
    //     }).orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'ID : " + id));
    // }

    // Supprimer un caissier
    public void supprimerCaissier(Long id) {
        caissierRepository.deleteById(id);
    }

    // Récupérer les caissiers actifs
    public List<Caissier> obtenirCaissiersActifs() {
        return caissierRepository.findByActif(true);
    }

    // Récupérer les caissiers par horaires de travail
    public List<Caissier> obtenirCaissiersParHoraires(String horairesTravail) {
        return caissierRepository.findByHorairesTravail(horairesTravail);
    }

    // Récupérer les caissiers affectés après une certaine date
    public List<Caissier> obtenirCaissiersAffectesApres(LocalDate date) {
        return caissierRepository.findByDateDebutAffectationAfter(date);
    }

    // Récupérer les caissiers actifs avec pagination
    public Page<Caissier> obtenirCaissiersActifsAvecPagination(Pageable pageable) {
        return caissierRepository.findByActif(true, pageable);
    }
}