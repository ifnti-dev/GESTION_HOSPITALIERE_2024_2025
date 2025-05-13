package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.RapportInventaire;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.RapportInventaireService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rapports-inventaire")
public class RapportInventaireController {

    private final RapportInventaireService rapportService;

    public RapportInventaireController(RapportInventaireService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping
    public List<RapportInventaire> getAllRapports() {
        return rapportService.getAllRapports();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RapportInventaire> getRapportById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.getRapportById(id));
    }

    @PostMapping
    public RapportInventaire createRapport(@RequestBody RapportInventaire rapport) {
        return rapportService.createRapport(rapport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RapportInventaire> updateRapport(@PathVariable Long id, @RequestBody RapportInventaire rapportDetails) {
        return ResponseEntity.ok(rapportService.updateRapport(id, rapportDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date/{date}")
    public List<RapportInventaire> getRapportsByDate(@PathVariable String date) {
        return rapportService.getRapportsByDate(LocalDate.parse(date));
    }

    @GetMapping("/periode")
    public List<RapportInventaire> getRapportsBetweenDates(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return rapportService.getRapportsBetweenDates(
                LocalDate.parse(startDate),
                LocalDate.parse(endDate));
    }
}

