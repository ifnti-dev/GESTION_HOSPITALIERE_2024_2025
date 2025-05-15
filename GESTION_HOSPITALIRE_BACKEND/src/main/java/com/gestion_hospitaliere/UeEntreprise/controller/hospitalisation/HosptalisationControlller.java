package com.gestion_hospitaliere.UeEntreprise.controller.hospitalisation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.Hospitalisation;
import com.gestion_hospitaliere.UeEntreprise.service.Hospitalisation.HospitalisationService;

@RestController
@RequestMapping("/api/hospitalisations")
public class HosptalisationControlller {

    @Autowired
    private HospitalisationService hospitalisationService;

    //  Lister toutes les hospitalisations
    @GetMapping
    public List<Hospitalisation> getAllHospitalisations() {
        return hospitalisationService.findAll();
    }

    //  Récupérer une hospitalisation par ID
    @GetMapping("/{id}")
    public Optional<Hospitalisation> getHospitalisationById(@PathVariable Long id) {
        return hospitalisationService.findById(id);
    }

    //  Créer une hospitalisation
    @PostMapping
    public Hospitalisation createHospitalisation(@RequestBody Hospitalisation hospitalisation) {
        return hospitalisationService.save(hospitalisation);
    }

    // ✏Modifier une hospitalisation
    @PutMapping("/{id}")
    public Hospitalisation updateHospitalisation(@PathVariable Long id, @RequestBody Hospitalisation hospitalisation) {
        hospitalisation.setId(id);
        return hospitalisationService.save(hospitalisation);
    }

    //  SHospitalisationupprimer une hospitalisation
    @DeleteMapping("/{id}")
    public void deleteHospitalisation(@PathVariable Long id) {
        hospitalisationService.deleteById(id);
    }



}
