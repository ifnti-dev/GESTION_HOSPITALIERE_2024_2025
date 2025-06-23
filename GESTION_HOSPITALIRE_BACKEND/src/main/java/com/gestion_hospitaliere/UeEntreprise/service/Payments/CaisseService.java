package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.CaisseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;

@Service
public class CaisseService {

    @Autowired
    private CaisseRepository caisseRepository;

    @Autowired
    private EmployeRepository caissierRepository;


    public List<Caisse> getAllCaisses() {
        return caisseRepository.findAll();
    }

    public Caisse getCaisseById(Long id) {
        return caisseRepository.findById(id).orElse(null);
    }

    public Caisse createCaisse(Caisse caisse) {
    Long employeId = caisse.getEmploye().getId();

    Employe employe = caissierRepository.findById(employeId)
        .orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'id : " + employeId));

    // Validation du numéro de caisse
    if (caisse.getNumeroCaisse() == null || caisse.getNumeroCaisse().isBlank()) {
        throw new IllegalArgumentException("Le numéro de caisse doit être renseigné.");
    }

    // (Optionnel) Vérifier unicité du numéro de caisse si nécessaire
    if (caisseRepository.existsByNumeroCaisse(caisse.getNumeroCaisse())) {
        throw new IllegalArgumentException("Un caisse avec ce numéro existe déjà.");
    }

    // Validation du montant total encaissé (peut être null ou >= 0 selon contexte)
    if (caisse.getMontantTotalEncaisse() == null || caisse.getMontantTotalEncaisse() < 0) {
        throw new IllegalArgumentException("Le montant total encaissé doit être renseigné et supérieur ou égal à 0.");
    }

    caisse.setEmploye(employe);

    return caisseRepository.save(caisse);
}


    public Caisse updateCaisse(Long id, Caisse updatedCaisse) {
    if (!caisseRepository.existsById(id)) {
        throw new RuntimeException("Caisse non trouvée avec l'id : " + id);
    }

    Long employeId = updatedCaisse.getEmploye().getId();
    Employe employe = caissierRepository.findById(employeId)
        .orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'id : " + employeId));

    // Contrôle numéroCaisse (non nul, non vide, longueur max 50)
    if (updatedCaisse.getNumeroCaisse() == null || updatedCaisse.getNumeroCaisse().trim().isEmpty()) {
        throw new IllegalArgumentException("Le numéro de caisse doit être renseigné.");
    }
    if (updatedCaisse.getNumeroCaisse().length() > 50) {
        throw new IllegalArgumentException("Le numéro de caisse ne doit pas dépasser 50 caractères.");
    }

    // Contrôle montantTotalEncaisse (non nul, positif ou nul)
    if (updatedCaisse.getMontantTotalEncaisse() == null || updatedCaisse.getMontantTotalEncaisse() < 0) {
        throw new IllegalArgumentException("Le montant total encaissé doit être supérieur ou égal à zéro.");
    }

    updatedCaisse.setId(id);
    updatedCaisse.setEmploye(employe);

    return caisseRepository.save(updatedCaisse);
}


    public void deleteCaisse(Long id) {
        caisseRepository.deleteById(id);
    }

//    public List<Caisse> findByCaissierId(Long caissierId) {
//        return caisseRepository.findByCaissierId(caissierId);
//    }

    // Méthode ignorée car champ `active` non défini dans le modèle
    // public List<Caisse> findByActive(Boolean active) {
    //     return caisseRepository.findByActive(active);
    // }
}
