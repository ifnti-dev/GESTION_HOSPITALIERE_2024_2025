package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

@Service
public class DossierGrossesseService {

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private PersonneRepository personneRepository;

    public List<DossierGrossesse> getAll() {
        return dossierGrossesseRepository.findAll();
    }

    public Optional<DossierGrossesse> getById(Long id) {
        return dossierGrossesseRepository.findById(id);
    }

    public Optional<DossierGrossesse> getByPatientId(Long personneId) {
        return dossierGrossesseRepository.findByPersonneId(personneId);
    }

    public DossierGrossesse create(DossierGrossesse dossier) {
        Long personneId = dossier.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + personneId));

        // Vérification du sexe de la personne
        if (personne.getSexe() == null || !personne.getSexe().equalsIgnoreCase("F")) {
            throw new IllegalArgumentException(
                    "Le dossier de grossesse ne peut être créé que pour une personne de sexe féminin.");
        }

        dossier.setPersonne(personne);

        // Validation des champs STATIQUES uniquement
        // ----------------------------------------------------
        if (dossier.getDateOuverture() == null || dossier.getDateOuverture().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "La date d'ouverture doit être renseignée et ne peut pas être dans le futur.");
        }

        if (dossier.getNombreGrossesses() == null || dossier.getNombreGrossesses() < 0) {
            throw new IllegalArgumentException("Le nombre de grossesses doit être renseigné et supérieur ou égal à 0.");
        }

        if (dossier.getNombreAccouchements() == null || dossier.getNombreAccouchements() < 0) {
            throw new IllegalArgumentException(
                    "Le nombre d'accouchements doit être renseigné et supérieur ou égal à 0.");
        }

        if (dossier.getNombreAccouchements() > dossier.getNombreGrossesses()) {
            throw new IllegalArgumentException(
                    "Le nombre d'accouchements ne peut pas être supérieur au nombre de grossesses.");
        }

        if (dossier.getDateDerniereRegle() == null || dossier.getDateDerniereRegle().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "La date de la dernière règle doit être renseignée et ne peut pas être dans le futur.");
        }

        if (dossier.getDatePrevueAccouchement() == null
                || !dossier.getDatePrevueAccouchement().isAfter(dossier.getDateDerniereRegle())) {
            throw new IllegalArgumentException(
                    "La date prévue d'accouchement doit être renseignée et être après la date de la dernière règle.");
        }

        // Validation groupe sanguin (inclut Rh)
        List<String> groupesValides = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        if (dossier.getGroupeSanguin() == null || !groupesValides.contains(dossier.getGroupeSanguin())) {
            throw new IllegalArgumentException("Le groupe sanguin est invalide. Valeurs acceptées: " + groupesValides);
        }

        // Validation des sérologies (valeurs fixes)
        List<String> valeursSerologie = List.of("Positif", "Négatif", "Inconnue", "Non fait");
        List<String> valeursImmunisation = List.of("Immunisé", "Non immunisé");

        if (dossier.getStatutSerologieRubeole() == null
                || !valeursImmunisation.contains(dossier.getStatutSerologieRubeole())) {
            throw new IllegalArgumentException("Statut sérologie rubéole invalide.");
        }

        if (dossier.getStatutSerologieToxo() == null
                || !valeursImmunisation.contains(dossier.getStatutSerologieToxo())) {
            throw new IllegalArgumentException("Statut sérologie toxoplasmose invalide.");
        }

        if (dossier.getStatutSerologieHepatiteB() == null
                || !valeursSerologie.contains(dossier.getStatutSerologieHepatiteB())) {
            throw new IllegalArgumentException("Statut sérologie hépatite B invalide.");
        }

        if (dossier.getStatutSerologieHiv() == null
                || !valeursSerologie.contains(dossier.getStatutSerologieHiv())) {
            throw new IllegalArgumentException("Statut sérologie HIV invalide.");
        }

        if (dossier.getStatutSerologieSyphilis() == null
                || !valeursSerologie.contains(dossier.getStatutSerologieSyphilis())) {
            throw new IllegalArgumentException("Statut sérologie syphilis invalide.");
        }

        // Validation des nouveaux champs STATIQUES
        

        // Validation longueur des textes (antécédents détaillés)
        if (dossier.getAntecedentsMedicaux() != null && dossier.getAntecedentsMedicaux().length() > 2000) {
            throw new IllegalArgumentException("Les antécédents médicaux sont trop longs (max 2000 caractères).");
        }

        // SUPPRIMER LES VALIDATIONS POUR LES CHAMPS DYNAMIQUES QUI ONT ÉTÉ DÉPLACÉS :
        // - presenceDiabeteGestationnel
        // - presenceHypertensionGestationnelle
        // - observationsGenerales
        // - traitementsEnCours (maintenant dans ConsultationPrenatale)

        return dossierGrossesseRepository.save(dossier);
    }

    public DossierGrossesse update(Long id, DossierGrossesse updated) {
        if (!dossierGrossesseRepository.existsById(id)) {
            throw new RuntimeException("DossierGrossesse non trouvé avec l'id: " + id);
        }

        Long personneId = updated.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + personneId));

        if (personne.getSexe() == null || !personne.getSexe().equalsIgnoreCase("F")) {
            throw new IllegalArgumentException(
                    "Le dossier de grossesse ne peut être mis à jour que pour une personne de sexe féminin.");
        }

        updated.setId(id);
        updated.setPersonne(personne);

        if (updated.getDateOuverture() == null || updated.getDateOuverture().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "La date d'ouverture doit être renseignée et ne peut pas être dans le futur.");
        }

        if (updated.getNombreGrossesses() == null || updated.getNombreGrossesses() < 0) {
            throw new IllegalArgumentException("Le nombre de grossesses doit être renseigné et supérieur ou égal à 0.");
        }

        if (updated.getNombreAccouchements() == null || updated.getNombreAccouchements() < 0) {
            throw new IllegalArgumentException(
                    "Le nombre d'accouchements doit être renseigné et supérieur ou égal à 0.");
        }

        if (updated.getNombreAccouchements() > updated.getNombreGrossesses()) {
            throw new IllegalArgumentException(
                    "Le nombre d'accouchements ne peut pas être supérieur au nombre de grossesses.");
        }

        if (updated.getDateDerniereRegle() == null || updated.getDateDerniereRegle().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "La date de la dernière règle doit être renseignée et ne peut pas être dans le futur.");
        }

        if (updated.getDatePrevueAccouchement() == null
                || !updated.getDatePrevueAccouchement().isAfter(updated.getDateDerniereRegle())) {
            throw new IllegalArgumentException(
                    "La date prévue d'accouchement doit être renseignée et être après la date de la dernière règle.");
        }

        // Validation groupe sanguin (inclut Rh)
        List<String> groupesValides = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        if (updated.getGroupeSanguin() == null || !groupesValides.contains(updated.getGroupeSanguin())) {
            throw new IllegalArgumentException("Le groupe sanguin est invalide. Valeurs acceptées: " + groupesValides);
        }

        // Validation des sérologies (valeurs fixes)
        List<String> valeursSerologie = List.of("Positif", "Négatif", "Inconnue", "Non fait");
        List<String> valeursImmunisation = List.of("Immunisé", "Non immunisé");

        if (updated.getStatutSerologieRubeole() == null
                || !valeursImmunisation.contains(updated.getStatutSerologieRubeole())) {
            throw new IllegalArgumentException("Statut sérologie rubéole invalide.");
        }

        if (updated.getStatutSerologieToxo() == null
                || !valeursImmunisation.contains(updated.getStatutSerologieToxo())) {
            throw new IllegalArgumentException("Statut sérologie toxoplasmose invalide.");
        }

        if (updated.getStatutSerologieHepatiteB() == null
                || !valeursSerologie.contains(updated.getStatutSerologieHepatiteB())) {
            throw new IllegalArgumentException("Statut sérologie hépatite B invalide.");
        }

        if (updated.getStatutSerologieHiv() == null
                || !valeursSerologie.contains(updated.getStatutSerologieHiv())) {
            throw new IllegalArgumentException("Statut sérologie HIV invalide.");
        }

        if (updated.getStatutSerologieSyphilis() == null
                || !valeursSerologie.contains(updated.getStatutSerologieSyphilis())) {
            throw new IllegalArgumentException("Statut sérologie syphilis invalide.");
        }

        // Validation des nouveaux champs STATIQUES
        

        // Validation longueur des textes (antécédents détaillés)
        if (updated.getAntecedentsMedicaux() != null && updated.getAntecedentsMedicaux().length() > 2000) {
            throw new IllegalArgumentException("Les antécédents médicaux sont trop longs (max 2000 caractères).");
        }


        return dossierGrossesseRepository.save(updated);
    }

    public void delete(Long id) {
        dossierGrossesseRepository.deleteById(id);
    }
}