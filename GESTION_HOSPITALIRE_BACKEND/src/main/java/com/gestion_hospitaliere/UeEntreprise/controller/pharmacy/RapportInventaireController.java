package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

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

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.RapportInventaire;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.RapportInventaireService;

@RestController
@RequestMapping("/api/rapports-inventaire")
public class RapportInventaireController {
    private final RapportInventaireService rapportInventaireService;

    public RapportInventaireController(RapportInventaireService rapportInventaireService) {
        this.rapportInventaireService = rapportInventaireService;
    }

    @GetMapping
    public List<RapportInventaire> getAllRapportsInventaire() {
        return rapportInventaireService.getAllRapportsInventaire();
    }

    @GetMapping("/{id}")
    public RapportInventaire getRapportInventaireById(@PathVariable Long id) {
        return rapportInventaireService.getRapportInventaireById(id);
    }

    @PostMapping
    public RapportInventaire createRapportInventaire(@RequestBody RapportInventaire rapportInventaire) {
        return rapportInventaireService.saveRapportInventaire(rapportInventaire);
    }

    @PutMapping("/{id}")
    public RapportInventaire updateRapportInventaire(@PathVariable Long id, @RequestBody RapportInventaire rapportInventaire) {
        rapportInventaire.setId(id);
        return rapportInventaireService.saveRapportInventaire(rapportInventaire);
    }

    @DeleteMapping("/{id}")
    public void deleteRapportInventaire(@PathVariable Long id) {
        rapportInventaireService.deleteRapportInventaire(id);
    }

    @GetMapping("/by-employe/{employeId}")
    public List<RapportInventaire> getByEmployeId(@PathVariable Long employeId) {
        return rapportInventaireService.getByEmployeId(employeId);
    }

    @GetMapping("/by-date")
    public List<RapportInventaire> getByDateRapport(@RequestParam String date) {
        return rapportInventaireService.getByDateRapport(date);
    }

    @GetMapping("/search/contenu")
    public List<RapportInventaire> searchByContenuContaining(@RequestParam String keyword) {
        return rapportInventaireService.searchByContenuContaining(keyword);
    }
}