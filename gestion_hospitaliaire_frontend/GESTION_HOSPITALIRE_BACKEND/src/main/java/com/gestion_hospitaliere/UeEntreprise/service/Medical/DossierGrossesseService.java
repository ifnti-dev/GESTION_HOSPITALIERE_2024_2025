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

        // Validation des champs

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

        // Contrôle du rhesus (doit être "+" ou "-")
        if (dossier.getRhesus() == null || (!dossier.getRhesus().equals("+") && !dossier.getRhesus().equals("-"))) {
            throw new IllegalArgumentException("Le rhésus doit être '+' ou '-'.");
        }

        // Pour les statuts immunisations et sérologies, on peut contrôler qu'ils ne
        // sont pas nuls
        // ou qu'ils appartiennent à une liste fixe (exemple ici : "Positive",
        // "Négative", "Inconnue", "Non fait")
        List<String> valeursValides = List.of("Positive", "Négative", "Inconnue", "Non fait");

        if (dossier.getStatutImmunisationRubeole() == null
                || !valeursValides.contains(dossier.getStatutImmunisationRubeole())) {
            throw new IllegalArgumentException("Statut immunisation rubéole invalide.");
        }
        if (dossier.getStatutImmunisationToxo() == null
                || !valeursValides.contains(dossier.getStatutImmunisationToxo())) {
            throw new IllegalArgumentException("Statut immunisation toxoplasmose invalide.");
        }
        if (dossier.getStatutImmunisationHepatiteB() == null
                || !valeursValides.contains(dossier.getStatutImmunisationHepatiteB())) {
            throw new IllegalArgumentException("Statut immunisation hépatite B invalide.");
        }
        if (dossier.getStatutSerologieHiv() == null || !valeursValides.contains(dossier.getStatutSerologieHiv())) {
            throw new IllegalArgumentException("Statut sérologie HIV invalide.");
        }
        if (dossier.getStatutSerologieSyphilis() == null
                || !valeursValides.contains(dossier.getStatutSerologieSyphilis())) {
            throw new IllegalArgumentException("Statut sérologie syphilis invalide.");
        }

        // Booleans peuvent être nuls ou vrais/faux, à toi de décider s'ils sont
        // obligatoires ou pas
        // Exemples d'obligation:
        if (dossier.getPresenceDiabeteGestationnel() == null) {
            throw new IllegalArgumentException("Le champ présence diabète gestationnel doit être renseigné.");
        }
        if (dossier.getPresenceHypertensionGestationnelle() == null) {
            throw new IllegalArgumentException("Le champ présence hypertension gestationnelle doit être renseigné.");
        }

        // Ici tu peux aussi faire des contrôles sur la taille des textes (antecedents,
        // allergies, traitementsEnCours, observationsGenerales)
        // Par exemple pour éviter des textes trop longs (ex: >1000 caractères)
        if (dossier.getAntecedents() != null && dossier.getAntecedents().length() > 1000) {
            throw new IllegalArgumentException("Les antécédents sont trop longs.");
        }
        if (dossier.getAllergies() != null && dossier.getAllergies().length() > 1000) {
            throw new IllegalArgumentException("Les allergies sont trop longues.");
        }
        if (dossier.getTraitementsEnCours() != null && dossier.getTraitementsEnCours().length() > 1000) {
            throw new IllegalArgumentException("Les traitements en cours sont trop longs.");
        }
        if (dossier.getObservationsGenerales() != null && dossier.getObservationsGenerales().length() > 2000) {
            throw new IllegalArgumentException("Les observations générales sont trop longues.");
        }

        // Tu peux ajouter d'autres contrôles métier spécifiques si besoin

        return dossierGrossesseRepository.save(dossier);
    }

    public DossierGrossesse update(Long id, DossierGrossesse updated) {
        if (!dossierGrossesseRepository.existsById(id)) {
            throw new RuntimeException("DossierGrossesse non trouvé avec l'id: " + id);
        }

        Long personneId = updated.getPersonne().getId();
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + personneId));

        // Vérification que la personne est une femme
        if (personne.getSexe() == null || !personne.getSexe().equalsIgnoreCase("F")) {
            throw new IllegalArgumentException(
                    "Le dossier de grossesse ne peut être mis à jour que pour une personne de sexe féminin.");
        }

        // Assignations
        updated.setId(id);
        updated.setPersonne(personne);

        // Validation des champs

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

        // Contrôle du rhesus (doit être "+" ou "-")
        if (updated.getRhesus() == null || (!updated.getRhesus().equals("+") && !updated.getRhesus().equals("-"))) {
            throw new IllegalArgumentException("Le rhésus doit être '+' ou '-'.");
        }

        // Statuts immunisation et sérologie valides
        List<String> valeursValides = List.of("Positive", "Négative", "Inconnue", "Non fait");

        if (updated.getStatutImmunisationRubeole() == null
                || !valeursValides.contains(updated.getStatutImmunisationRubeole())) {
            throw new IllegalArgumentException("Statut immunisation rubéole invalide.");
        }
        if (updated.getStatutImmunisationToxo() == null
                || !valeursValides.contains(updated.getStatutImmunisationToxo())) {
            throw new IllegalArgumentException("Statut immunisation toxoplasmose invalide.");
        }
        if (updated.getStatutImmunisationHepatiteB() == null
                || !valeursValides.contains(updated.getStatutImmunisationHepatiteB())) {
            throw new IllegalArgumentException("Statut immunisation hépatite B invalide.");
        }
        if (updated.getStatutSerologieHiv() == null || !valeursValides.contains(updated.getStatutSerologieHiv())) {
            throw new IllegalArgumentException("Statut sérologie HIV invalide.");
        }
        if (updated.getStatutSerologieSyphilis() == null
                || !valeursValides.contains(updated.getStatutSerologieSyphilis())) {
            throw new IllegalArgumentException("Statut sérologie syphilis invalide.");
        }

        // Obligations sur les booleans
        if (updated.getPresenceDiabeteGestationnel() == null) {
            throw new IllegalArgumentException("Le champ présence diabète gestationnel doit être renseigné.");
        }
        if (updated.getPresenceHypertensionGestationnelle() == null) {
            throw new IllegalArgumentException("Le champ présence hypertension gestationnelle doit être renseigné.");
        }

        // Limite taille textes
        if (updated.getAntecedents() != null && updated.getAntecedents().length() > 1000) {
            throw new IllegalArgumentException("Les antécédents sont trop longs.");
        }
        if (updated.getAllergies() != null && updated.getAllergies().length() > 1000) {
            throw new IllegalArgumentException("Les allergies sont trop longues.");
        }
        if (updated.getTraitementsEnCours() != null && updated.getTraitementsEnCours().length() > 1000) {
            throw new IllegalArgumentException("Les traitements en cours sont trop longs.");
        }
        if (updated.getObservationsGenerales() != null && updated.getObservationsGenerales().length() > 2000) {
            throw new IllegalArgumentException("Les observations générales sont trop longues.");
        }

        // Autres contrôles spécifiques si besoin

        return dossierGrossesseRepository.save(updated);
    }

    public void delete(Long id) {
        dossierGrossesseRepository.deleteById(id);
    }
}