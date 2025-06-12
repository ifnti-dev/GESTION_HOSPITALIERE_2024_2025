package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;

import com.gestion_hospitaliere.UeEntreprise.repository.Payments.CaisseRepository;

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


       caisse.setEmploye(employe);

        return caisseRepository.save(caisse);
    }

    public Caisse updateCaisse(Long id, Caisse updatedCaisse) {
        if (!caisseRepository.existsById(id)) {
            return null;
        }

        Long employeId = updatedCaisse.getEmploye().getId();
        Employe employe = caissierRepository.findById(employeId)
            .orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'id : " + employeId));

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
