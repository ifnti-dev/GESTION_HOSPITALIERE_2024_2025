package com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement.SuiviEtatService;

@RestController
@RequestMapping("/api/suivi-etats")
public class SuiviEtatController {

    @Autowired
    private SuiviEtatService suiviEtatService;

    @GetMapping
    public List<SuiviEtat> getAllSuiviEtats() {
        return suiviEtatService.getAllSuiviEtats();
    }

    @GetMapping("/{id}")
    public SuiviEtat getSuiviEtatById(@PathVariable Long id) {
        return suiviEtatService.getSuiviEtatById(id);
    }

    @PostMapping
    public SuiviEtat createSuiviEtat(@RequestBody SuiviEtat suiviEtat) {
        return suiviEtatService.createSuiviEtat(suiviEtat);
    }

    @PutMapping("/{id}")
    public SuiviEtat updateSuiviEtat(@PathVariable Long id, @RequestBody SuiviEtat suiviEtat) {
        return suiviEtatService.updateSuiviEtat(id, suiviEtat);
    }

    @DeleteMapping("/{id}")
    public void deleteSuiviEtat(@PathVariable Long id) {
        suiviEtatService.deleteSuiviEtat(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<SuiviEtat> findByPatientId(@PathVariable Long patientId) {
        return suiviEtatService.findByPatientId(patientId);
    }

    @GetMapping("/date")
    public List<SuiviEtat> findByDate(@RequestParam LocalDate date) {
        return suiviEtatService.findByDate(date);
    }

    @GetMapping("/temperature")
    public List<SuiviEtat> findByTemperature(@RequestParam Integer temperature) {
        return suiviEtatService.findByTemperature(temperature);
    }

    @GetMapping("/tension")
    public List<SuiviEtat> findByTension(@RequestParam Float tension) {
        return suiviEtatService.findByTension(tension);
    }

    @GetMapping("/observations")
    public List<SuiviEtat> findByObservationsContaining(@RequestParam String observations) {
        return suiviEtatService.findByObservationsContaining(observations);
    }
}