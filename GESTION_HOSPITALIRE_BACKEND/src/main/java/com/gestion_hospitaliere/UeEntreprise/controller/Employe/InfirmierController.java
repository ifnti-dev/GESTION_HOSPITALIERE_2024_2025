package com.gestion_hospitaliere.UeEntreprise.controller.Employe;


import com.gestion_hospitaliere.UeEntreprise.model.Employe.Infirmier;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.InfirmierService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/infirmiers")
public class InfirmierController {

    private final InfirmierService infirmierService;

    public InfirmierController(InfirmierService infirmierService) {
        this.infirmierService = infirmierService;
    }

    @PostMapping
    public ResponseEntity<Infirmier> ajouter(@RequestBody Infirmier infirmier) {
        return ResponseEntity.ok(infirmierService.ajouterInfirmier(infirmier));
    }

    @GetMapping
    public List<Infirmier> lister() {
        return infirmierService.listerInfirmiers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Infirmier> trouverParId(@PathVariable Long id) {
        return infirmierService.trouverParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Infirmier> modifier(@PathVariable Long id, @RequestBody Infirmier infirmier) {
        return ResponseEntity.ok(infirmierService.modifierInfirmier(id, infirmier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        infirmierService.supprimerInfirmier(id);
        return ResponseEntity.noContent().build();
    }
}