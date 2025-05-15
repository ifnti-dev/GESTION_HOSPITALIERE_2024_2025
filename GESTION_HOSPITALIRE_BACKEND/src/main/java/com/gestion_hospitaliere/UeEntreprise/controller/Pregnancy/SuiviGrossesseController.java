package com.gestion_hospitaliere.UeEntreprise.controller.Pregnancy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;
import com.gestion_hospitaliere.UeEntreprise.service.Pregnancy.SuiviGrossesseService;

@RestController
@RequestMapping("/api/suivis-grossesse")
@CrossOrigin
public class SuiviGrossesseController {

    @Autowired
    private SuiviGrossesseService service;

    @GetMapping
    public List<SuiviGrossesse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuiviGrossesse> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dossier/{dossierId}")
    public List<SuiviGrossesse> getByDossier(@PathVariable Long dossierId) {
        return service.getByDossierGrossesseId(dossierId);
    }

    @PostMapping
    public ResponseEntity<SuiviGrossesse> create(@RequestBody SuiviGrossesse suivi) {
        return ResponseEntity.ok(service.create(suivi));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiviGrossesse> update(@PathVariable Long id, @RequestBody SuiviGrossesse suivi) {
        try {
            return ResponseEntity.ok(service.update(id, suivi));
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