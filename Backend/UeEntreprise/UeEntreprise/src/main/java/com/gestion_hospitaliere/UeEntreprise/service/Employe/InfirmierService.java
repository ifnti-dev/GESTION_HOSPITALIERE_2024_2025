package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Infirmier;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.InfirmierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InfirmierService {

    @Autowired
    private InfirmierRepository infirmierRepository;

    // Ajouter un infirmier
    public Infirmier ajouterInfirmier(Infirmier infirmier) {
        return infirmierRepository.save(infirmier);
    }

    // Récupérer tous les infirmiers
    public List<Infirmier> obtenirTousLesInfirmiers() {
        return infirmierRepository.findAll();
    }

    // Récupérer un infirmier par ID
    public Optional<Infirmier> obtenirInfirmierParId(Long id) {
        return infirmierRepository.findById(id);
    }

    // Mettre à jour un infirmier
    public Infirmier mettreAJourInfirmier(Long id, Infirmier infirmierDetails) {
        Optional<Infirmier> infirmierOptional = infirmierRepository.findById(id);
        if (infirmierOptional.isPresent()) {
            Infirmier infirmier = infirmierOptional.get();
            // Mise à jour des champs spécifiques
            infirmier.setSpecialite(infirmierDetails.getSpecialite());
            infirmier.setHorairesTravail(infirmierDetails.getHorairesTravail());
            infirmier.setDateDebutAffectation(infirmierDetails.getDateDebutAffectation());
            infirmier.setActif(infirmierDetails.getActif());
            return infirmierRepository.save(infirmier);
        } else {
            throw new RuntimeException("Infirmier non trouvé avec l'ID : " + id);
        }
    }

    // Supprimer un infirmier
    public void supprimerInfirmier(Long id) {
        infirmierRepository.deleteById(id);
    }

    // Récupérer les infirmiers actifs
    public List<Infirmier> obtenirInfirmiersActifs() {
        return infirmierRepository.findAll().stream()
                .filter(Infirmier::getActif)
                .toList();
    }
}
