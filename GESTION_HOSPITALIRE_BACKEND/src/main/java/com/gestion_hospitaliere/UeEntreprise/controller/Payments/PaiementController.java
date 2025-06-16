package com.gestion_hospitaliere.UeEntreprise.controller.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Paiement;
import com.gestion_hospitaliere.UeEntreprise.service.Payments.PaiementService;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    @GetMapping
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    @GetMapping("/{id}")
    public Paiement getPaiementById(@PathVariable("id") Long id) {
        return paiementService.getPaiementById(id);
    }

    @PostMapping
    public Paiement createPaiement(@RequestBody Paiement paiement) {
        return paiementService.createPaiement(paiement);
    }

    @PutMapping("/{id}")
    public Paiement updatePaiement(@PathVariable("id") Long id, @RequestBody Paiement paiement) {
        return paiementService.updatePaiement(id, paiement);
    }

    @DeleteMapping("/{id}")
    public void deletePaiement(@PathVariable("id") Long id) {
        paiementService.deletePaiement(id);
    }


    @GetMapping("/montant")
    public List<Paiement> findByMontant(@RequestParam Double montant) {
        return paiementService.findByMontant(montant);
    }

    @GetMapping("/date")
    public List<Paiement> findByDate(@RequestParam LocalDate date) {
        return paiementService.findByDate(date);
    }

    @GetMapping("/moyen")
    public List<Paiement> findByMoyen(@RequestParam String moyen) {
        return paiementService.findByMoyen(moyen);
    }

    @GetMapping("/facture/{factureId}")
    public List<Paiement> findByFactureId(@PathVariable Long factureId) {
        return paiementService.findByFactureId(factureId);
    }

    @GetMapping("/montant/greater")
    public List<Paiement> findByMontantGreaterThan(@RequestParam Double montant) {
        return paiementService.findByMontantGreaterThan(montant);
    }

    @GetMapping("/montant/less")
    public List<Paiement> findByMontantLessThan(@RequestParam Double montant) {
        return paiementService.findByMontantLessThan(montant);
    }
}