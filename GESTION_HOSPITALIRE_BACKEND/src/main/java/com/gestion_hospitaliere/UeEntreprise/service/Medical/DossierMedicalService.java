package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierMedicalRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

import jakarta.transaction.Transactional;

@Service
public class DossierMedicalService {

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    private PersonneRepository personneRepository;

    public List<DossierMedical> getAllDossiers() {
        return dossierMedicalRepository.findAll();
    }

    public Optional<DossierMedical> getDossierById(Long id) {
        return dossierMedicalRepository.findById(id);
    }

    public Optional<DossierMedical> getDossierByGroupeSanguin(String groupeSanguin) {
        return dossierMedicalRepository.findByGroupeSanguin(groupeSanguin);
    }

    public Optional<DossierMedical> getDossierByPatientId(Long personneId) {
        return dossierMedicalRepository.findByPersonneId(personneId);
    }

    public DossierMedical saveDossier(DossierMedical dossierMedical) {
        Long personneId = dossierMedical.getPersonne().getId();

        // Vérifier que la personne existe
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + personneId));

        // Vérifier qu'il n'existe pas déjà un dossier médical pour cette personne
        Optional<DossierMedical> dossierExist = dossierMedicalRepository.findByPersonneId(personneId);
        if (dossierExist.isPresent()) {
            throw new IllegalArgumentException("Le patient possède déjà un dossier médical.");
        }

        // Validation des champs texte (limite arbitraire à 1000 caractères par exemple)
        if (dossierMedical.getAntecedents() != null && dossierMedical.getAntecedents().length() > 1000) {
            throw new IllegalArgumentException("Les antécédents sont trop longs.");
        }
        if (dossierMedical.getAllergies() != null && dossierMedical.getAllergies().length() > 1000) {
            throw new IllegalArgumentException("Les allergies sont trop longues.");
        }
        if (dossierMedical.getTraitementsEnCours() != null && dossierMedical.getTraitementsEnCours().length() > 1000) {
            throw new IllegalArgumentException("Les traitements en cours sont trop longs.");
        }

        // Validation tension (par exemple entre 0 et 30, correspondant à 0-30 kPa ou
        // 0-300 mmHg)
        Float tension = dossierMedical.getTension();
        if (tension == null || tension < 0 || tension > 30) {
            throw new IllegalArgumentException("La tension doit être renseignée et comprise entre 0 et 30.");
        }

        // Validation groupe sanguin (ex: A+, A-, B+, B-, AB+, AB-, O+, O-)
        List<String> groupesValides = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        if (dossierMedical.getGroupeSanguin() == null || !groupesValides.contains(dossierMedical.getGroupeSanguin())) {
            throw new IllegalArgumentException("Le groupe sanguin est invalide.");
        }

        // Associer la personne validée au dossier
        dossierMedical.setPersonne(personne);

        // Sauvegarder et retourner
        return dossierMedicalRepository.save(dossierMedical);
    }

    @Transactional
    public void deleteDossier(Long id) {
        DossierMedical dossier = dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé"));

        //Détacher le dossier du Patient (côté propriétaire ET inverse)
        Personne patient = dossier.getPersonne();
        if (patient != null) {
        patient.setDossierMedical(null); // Côté inverse (Patient)
        dossier.setPersonne(null); // Côté propriétaire (DossierMedical)
        }

        dossierMedicalRepository.delete(dossier); // Suppression unique
    }

    public DossierMedical updateDossier(Long id, DossierMedical updatedDossier) {
        if (!dossierMedicalRepository.existsById(id)) {
            throw new RuntimeException("Dossier médical non trouvé avec l'id : " + id);
        }

        Long patientId = updatedDossier.getPersonne().getId();

        Personne patient = personneRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + patientId));

        // Vérifier qu'il n'y a pas un autre dossier pour ce patient
        Optional<DossierMedical> dossierExist = dossierMedicalRepository.findByPersonneId(patientId);
        if (dossierExist.isPresent() && !dossierExist.get().getId().equals(id)) {
            throw new IllegalArgumentException("Le patient possède déjà un autre dossier médical.");
        }

        // Validation champs texte
        if (updatedDossier.getAntecedents() != null && updatedDossier.getAntecedents().length() > 1000) {
            throw new IllegalArgumentException("Les antécédents sont trop longs.");
        }
        if (updatedDossier.getAllergies() != null && updatedDossier.getAllergies().length() > 1000) {
            throw new IllegalArgumentException("Les allergies sont trop longues.");
        }
        if (updatedDossier.getTraitementsEnCours() != null && updatedDossier.getTraitementsEnCours().length() > 1000) {
            throw new IllegalArgumentException("Les traitements en cours sont trop longs.");
        }

        // Validation tension
        Float tension = updatedDossier.getTension();
        if (tension == null || tension < 0 || tension > 30) {
            throw new IllegalArgumentException("La tension doit être renseignée et comprise entre 0 et 30.");
        }

        // Validation groupe sanguin
        List<String> groupesValides = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        if (updatedDossier.getGroupeSanguin() == null || !groupesValides.contains(updatedDossier.getGroupeSanguin())) {
            throw new IllegalArgumentException("Le groupe sanguin est invalide.");
        }

        updatedDossier.setId(id);
        updatedDossier.setPersonne(patient);

        return dossierMedicalRepository.save(updatedDossier);
    }

}
