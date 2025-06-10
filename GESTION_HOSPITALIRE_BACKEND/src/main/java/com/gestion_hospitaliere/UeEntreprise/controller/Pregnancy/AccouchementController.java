package com.gestion_hospitaliere.UeEntreprise.controller.Pregnancy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.service.Pregnancy.AccouchementService;

@RestController
@RequestMapping("/api/accouchements")
@CrossOrigin
public class AccouchementController {

    @Autowired
    private AccouchementService service;

    @GetMapping
    public List<Accouchement> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accouchement> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dossier/{dossierId}")
    public List<Accouchement> getByDossier(@PathVariable Long dossierId) {
        return service.getByDossierGrossesseId(dossierId);
    }

//    @GetMapping("/sagefemme/{sageFemmeId}")
//    public List<Accouchement> getBySageFemme(@PathVariable Long sageFemmeId) {
//        return service.getBySageFemmeId(sageFemmeId);
//    }

    @PostMapping
    public ResponseEntity<Accouchement> create(@RequestBody Accouchement accouchement) {
        return ResponseEntity.ok(service.create(accouchement));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Accouchement> update(@PathVariable Long id, @RequestBody Accouchement accouchement) {
        try {
            return ResponseEntity.ok(service.update(id, accouchement));
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