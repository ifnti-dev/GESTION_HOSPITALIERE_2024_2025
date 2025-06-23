package com.gestion_hospitaliere.UeEntreprise.controller.Medical;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.service.Medical.DossierGrossesseService;

@RestController
@RequestMapping("/api/dossiers-grossesse")
@CrossOrigin
public class DossierGrossesseController {

    @Autowired
    private DossierGrossesseService service;

    @GetMapping
    public List<DossierGrossesse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierGrossesse> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/patient/{patientId}")
    public ResponseEntity<DossierGrossesse> getByPatientId(@PathVariable Long patientId) {
        return service.getByPatientId(patientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DossierGrossesse> create(@RequestBody DossierGrossesse dossier) {
        return ResponseEntity.ok(service.create(dossier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DossierGrossesse> update(@PathVariable Long id, @RequestBody DossierGrossesse dossier) {
        try {
            return ResponseEntity.ok(service.update(id, dossier));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}