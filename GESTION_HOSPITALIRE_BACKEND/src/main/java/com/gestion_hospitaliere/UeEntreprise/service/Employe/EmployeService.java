package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

@Service
public class EmployeService {

    @Autowired
    private EmployeRepository employeRepository;

    // Ajouter un employé
    public Employe ajouterEmploye(Employe employe) {
        return employeRepository.save(employe);
    }

    // Récupérer tous les employés
    public List<Employe> obtenirTousLesEmployes() {
        return employeRepository.findAll();
    }

    // Récupérer un employé par ID
    public Optional<Employe> obtenirEmployeParId(Long id) {
        return employeRepository.findById(id);
    }

    // Mettre à jour un employé
    public Employe mettreAJourEmploye(Long id, Employe employeDetails) {
        Optional<Employe> employeOptional = employeRepository.findById(id);
        if (employeOptional.isPresent()) {
            Employe employe = employeOptional.get();
            // Exemple : mise à jour des champs
            employe.setId(employeDetails.getId());
            // employe.setRole(employeDetails.getRole());
            return employeRepository.save(employe);
        } else {
            throw new RuntimeException("Employé non trouvé avec l'ID : " + id);
        }
    }

    // Supprimer un employé
    public void supprimerEmploye(Long id) {
        employeRepository.deleteById(id);
    }
}