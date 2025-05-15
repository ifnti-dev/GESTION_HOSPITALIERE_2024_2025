package com.gestion_hospitaliere.UeEntreprise.controller.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.service.Payments.FactureService;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public Facture getFactureById(@PathVariable Long id) {
        return factureService.getFactureById(id);
    }

    @PostMapping
    public Facture createFacture(@RequestBody Facture facture) {
        return factureService.createFacture(facture);
    }

    @PutMapping("/{id}")
    public Facture updateFacture(@PathVariable Long id, @RequestBody Facture facture) {
        return factureService.updateFacture(id, facture);
    }

    @DeleteMapping("/{id}")
    public void deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
    }

    @GetMapping("/date")
    public List<Facture> findByDate(@RequestParam LocalDate date) {
        return factureService.findByDate(date);
    }
}