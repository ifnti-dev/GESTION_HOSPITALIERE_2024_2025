// package com.gestion_hospitaliere.UeEntreprise.controller.hospitalisation;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.Hospitalisation;
// import com.gestion_hospitaliere.UeEntreprise.service.Hospitalisation.HospitalisationService;
// import jakarta.validation.Valid;

// @RestController
// @RequestMapping("/api/hospitalisations")
// public class HosptalisationControlller {

//     @Autowired
//     private HospitalisationService hospitalisationService;

//     // ✅ Lister toutes les hospitalisations
//     @GetMapping
//     public List<Hospitalisation> getAllHospitalisations() {
//         return hospitalisationService.findAll();
//     }

//     // ✅ Récupérer une hospitalisation par ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Hospitalisation> getHospitalisationById(@PathVariable Long id) {
//         return hospitalisationService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // ✅ Créer une hospitalisation (l'ID est généré automatiquement)
//     @PostMapping
//     public ResponseEntity<Hospitalisation> createHospitalisation(@Valid @RequestBody Hospitalisation hospitalisation) {
//         // l’ID doit être null pour que Hibernate le génère automatiquement
//         hospitalisation.setId(null);
//         Hospitalisation created = hospitalisationService.save(hospitalisation);
//         return new ResponseEntity<>(created, HttpStatus.CREATED);
//     }

//     // ✅ Modifier une hospitalisation en toute sécurité
//     @PutMapping("/{id}")
//     public ResponseEntity<Hospitalisation> updateHospitalisation(@PathVariable Long id, @Valid @RequestBody Hospitalisation hospitalisation) {
//         return hospitalisationService.findById(id).map(existing -> {
//             // Mettre à jour les champs un par un
//             existing.setLit(hospitalisation.getLit());
//             existing.setDateEntree(hospitalisation.getDateEntree());
//             existing.setDateSortie(hospitalisation.getDateSortie());
//             existing.setService(hospitalisation.getService());
//             // Note: Le patient n'est pas mis à jour ici, ce qui peut être intentionnel.
//             // Si 'patient' est @NotNull dans Hospitalisation, il devra être présent et valide dans le corps de la requête.

//             Hospitalisation updated = hospitalisationService.save(existing);
//             return ResponseEntity.ok(updated);
//         }).orElse(ResponseEntity.notFound().build());
//     }
 
//     // ✅ Supprimer une hospitalisation

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteHospitalisation(@PathVariable Long id) {
//         return hospitalisationService.findById(id)
//                 .map(hospitalisation -> {
//                     hospitalisationService.deleteById(id);
//                     return ResponseEntity.noContent().<Void>build();
//                 })
//                 .orElse(ResponseEntity.notFound().build());
//     }

// }
