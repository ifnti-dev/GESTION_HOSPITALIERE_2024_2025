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

import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.ReferenceService;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Reference;

@RestController
@RequestMapping("/api/references")
public class ReferenceController {
    private final ReferenceService referenceService;

    public ReferenceController(ReferenceService referenceService) {
        this.referenceService = referenceService;
    }

    @GetMapping
    public List<Reference> getAllReferences() {
        return referenceService.getAllReferences();
    }

    @GetMapping("/{id}")
    public Reference getReferenceById(@PathVariable Long id) {
        return referenceService.getReferenceById(id);
    }

    @PostMapping
    public Reference createReference(@RequestBody Reference reference) {
        return referenceService.saveReference(reference);
    }

    @PutMapping("/{id}")
    public Reference updateReference(@PathVariable Long id, @RequestBody Reference reference) {
        reference.setId(id);
        return referenceService.saveReference(reference);
    }

    @DeleteMapping("/{id}")
    public void deleteReference(@PathVariable Long id) {
        referenceService.deleteReference(id);
    }

    @GetMapping("/search/nom")
    public List<Reference> searchByNomContaining(@RequestParam String nom) {
        return referenceService.searchByNomContaining(nom);
    }

}