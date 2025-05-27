package com.gestion_hospitaliere.UeEntreprise.controller.Payments;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;
import com.gestion_hospitaliere.UeEntreprise.service.Payments.CaisseService;

@RestController
@RequestMapping("/api/caisses")
public class CaisseController {

    @Autowired
    private CaisseService caisseService;

    @GetMapping
    public List<Caisse> getAllCaisses() {
        return caisseService.getAllCaisses();
    }

    @GetMapping("/{id}")
    public Caisse getCaisseById(@PathVariable("id") Long id) {
        return caisseService.getCaisseById(id);
    }

    @PostMapping
    public Caisse createCaisse(@RequestBody Caisse caisse) {
        return caisseService.createCaisse(caisse);
    }

    @PutMapping("/{id}")
    public Caisse updateCaisse(@PathVariable("id") Long id, @RequestBody Caisse caisse) {
        return caisseService.updateCaisse(id, caisse);
    }

    @DeleteMapping("/{id}")
    public void deleteCaisse(@PathVariable("id") Long id) {
        caisseService.deleteCaisse(id);
    }

    @GetMapping("/caissier/{caissierId}")
    public List<Caisse> findByCaissierId(@PathVariable("id") Long caissierId) {
        return caisseService.findByCaissierId(caissierId);
    }

//     @GetMapping("/active")
//     public List<Caisse> findByActive(@RequestParam Boolean active) {
//         return caisseService.findByActive(active);
//     }
 }