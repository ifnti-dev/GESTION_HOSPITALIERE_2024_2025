package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Pharmacien;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.PharmacienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PharmacienService {

    @Autowired
    private PharmacienRepository pharmacienRepository;

    // Ajouter un pharmacien
    public Pharmacien ajouterPharmacien(Pharmacien pharmacien) {
        return pharmacienRepository.save(pharmacien);
    }

    // Récupérer tous les pharmaciens
    public List<Pharmacien> obtenirTousLesPharmaciens() {
        return pharmacienRepository.findAll();
    }

    // Récupérer un pharmacien par ID
    public Optional<Pharmacien> obtenirPharmacienParId(Long id) {
        return pharmacienRepository.findById(id);
    }

    // Mettre à jour un pharmacien
    public Pharmacien mettreAJourPharmacien(Long id, Pharmacien pharmacienDetails) {
        Optional<Pharmacien> pharmacienOptional = pharmacienRepository.findById(id);
        if (pharmacienOptional.isPresent()) {
            Pharmacien pharmacien = pharmacienOptional.get();
            // Mise à jour des champs spécifiques
            pharmacien.setNumeroLicence(pharmacienDetails.getNumeroLicence());
            pharmacien.setDateDebutAffectation(pharmacienDetails.getDateDebutAffectation());
            pharmacien.setHorairesTravail(pharmacienDetails.getHorairesTravail());
            pharmacien.setActif(pharmacienDetails.getActif());
            return pharmacienRepository.save(pharmacien);
        } else {
            throw new RuntimeException("Pharmacien non trouvé avec l'ID : " + id);
        }
    }

    // Supprimer un pharmacien
    public void supprimerPharmacien(Long id) {
        pharmacienRepository.deleteById(id);
    }

    // Récupérer les pharmaciens actifs
    public List<Pharmacien> obtenirPharmaciensActifs() {
        return pharmacienRepository.findAll().stream()
                .filter(Pharmacien::getActif)
                .toList();
    }

    // Récupérer les pharmaciens par numéro de licence
    public List<Pharmacien> obtenirPharmaciensParNumeroLicence(String numeroLicence) {
        return pharmacienRepository.findAll().stream()
                .filter(pharmacien -> numeroLicence.equalsIgnoreCase(pharmacien.getNumeroLicence()))
                .toList();
    }
}
