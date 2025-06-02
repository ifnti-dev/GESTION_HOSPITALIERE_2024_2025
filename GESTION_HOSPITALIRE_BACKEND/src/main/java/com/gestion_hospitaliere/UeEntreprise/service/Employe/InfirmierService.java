package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Infirmier;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.InfirmierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InfirmierService {

    private final InfirmierRepository infirmierRepository;

    public InfirmierService(InfirmierRepository infirmierRepository) {
        this.infirmierRepository = infirmierRepository;
    }

    public Infirmier ajouterInfirmier(Infirmier infirmier) {
        return infirmierRepository.save(infirmier);
    }

    public List<Infirmier> listerInfirmiers() {
        return infirmierRepository.findAll();
    }

    public Optional<Infirmier> trouverParId(Long id) {
        return infirmierRepository.findById(id);
    }

    public Infirmier modifierInfirmier(Long id, Infirmier nouvelInfirmier) {
        return infirmierRepository.findById(id)
                .map(inf -> {
                    inf.setNom(nouvelInfirmier.getNom());
                    inf.setPrenom(nouvelInfirmier.getPrenom());
                    inf.setNomUtilisateur(nouvelInfirmier.getNomUtilisateur());
                    inf.setPassword(nouvelInfirmier.getPassword());
                    inf.setEmail(nouvelInfirmier.getEmail());
                    inf.setSpecialite(nouvelInfirmier.getSpecialite());
                    inf.setHorairesTravail(nouvelInfirmier.getHorairesTravail());
                    inf.setDateDebutAffectation(nouvelInfirmier.getDateDebutAffectation());
                    inf.setActif(nouvelInfirmier.getActif());
                    return infirmierRepository.save(inf);
                })
                .orElseThrow(() -> new RuntimeException("Infirmier non trouvé"));
    }

    public void supprimerInfirmier(Long id) {
        infirmierRepository.deleteById(id);
    }
}