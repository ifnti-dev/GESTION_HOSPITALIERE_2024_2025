package com.gestion_hospitaliere.UeEntreprise.controller.User;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.service.User.EmployeService;

@RestController
@RequestMapping("api/employe")
public class EmployeUserController {

	@Autowired
    private EmployeService employeService;

    // Ajouter un nouvel employé
    @PostMapping
    public ResponseEntity<Employe> ajouterEmploye(@RequestBody Employe employe) {
        try {
            Employe nouvelEmploye = employeService.ajouterEmploye(employe);
            return new ResponseEntity<>(nouvelEmploye, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // 🔹 Récupérer tous les employés
    @GetMapping
    public ResponseEntity<List<Employe>> obtenirTousLesEmployes() {
        List<Employe> employes = employeService.obtenirTousLesEmployes();
        return new ResponseEntity<>(employes, HttpStatus.OK);
    }

    // 🔹 Récupérer un employé par ID
    @GetMapping("/{id}")
    public ResponseEntity<Employe> obtenirEmployeParId(@PathVariable Long id) {
        Optional<Employe> employe = employeService.obtenirEmployeParId(id);
        return employe.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 🔹 Mettre à jour un employé
    @PutMapping("/{id}")
    public ResponseEntity<Employe> mettreAJourEmploye(@PathVariable Long id, @RequestBody Employe employeDetails) {
        try {
            Employe employeMisAJour = employeService.mettreAJourEmploye(id, employeDetails);
            return new ResponseEntity<>(employeMisAJour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 🔹 Supprimer un employé
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerEmploye(@PathVariable Long id) {
        try {
            employeService.supprimerEmploye(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}