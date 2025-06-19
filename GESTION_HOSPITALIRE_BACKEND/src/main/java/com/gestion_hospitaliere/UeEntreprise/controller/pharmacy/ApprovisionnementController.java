package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;


import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Approvisionnement;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.ApprovisionnementService;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/approvisionnements")
public class ApprovisionnementController {
    private final ApprovisionnementService approvisionnementService;

    public ApprovisionnementController(ApprovisionnementService approvisionnementService) {
        this.approvisionnementService = approvisionnementService;
    }

    @GetMapping
    public List<Approvisionnement> getAllApprovisionnements() {
        return approvisionnementService.getAllApprovisionnements();
    }

    @GetMapping("/{id}")
    public Approvisionnement getApprovisionnementById(@PathVariable Long id) {
        return approvisionnementService.getApprovisionnementById(id);
    }

    @PostMapping
    public Approvisionnement createApprovisionnement(@RequestBody Approvisionnement approvisionnement) {
        return approvisionnementService.saveApprovisionnement(approvisionnement);
    }

    @PutMapping("/{id}")
    public Approvisionnement updateApprovisionnement(@PathVariable Long id, @RequestBody Approvisionnement approvisionnement) {
        approvisionnement.setId(id);
        return approvisionnementService.saveApprovisionnement(approvisionnement);
    }

    @DeleteMapping("/{id}")
    public void deleteApprovisionnement(@PathVariable Long id) {
        approvisionnementService.deleteApprovisionnement(id);
    }

    @GetMapping("/by-date")
    public List<Approvisionnement> getApprovisionnementsByDate(@RequestParam LocalDate date) {
        return approvisionnementService.getApprovisionnementsByDate(date);
    }

    @GetMapping("/by-fournisseur")
    public List<Approvisionnement> getApprovisionnementsByFournisseur(@RequestParam String fournisseur) {
        return approvisionnementService.getApprovisionnementsByFournisseur(fournisseur);
    }

    @GetMapping("/by-employe/{employeId}")
    public List<Approvisionnement> getApprovisionnementsByEmployeId(@PathVariable Long employeId) {
        return approvisionnementService.getApprovisionnementsByEmployeId(employeId);
    }
}