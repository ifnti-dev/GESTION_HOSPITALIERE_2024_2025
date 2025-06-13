// package com.gestion_hospitaliere.UeEntreprise.controller.Medical;

// import java.net.URI;
// import java.util.List;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
// import com.gestion_hospitaliere.UeEntreprise.service.Medical.PatientService;

// @RestController
// @RequestMapping("/api/patients")
// @CrossOrigin
// public class PatientController {

//     @Autowired
//     private PatientService patientService;

//     @GetMapping
//     public List<Patient> getAllPatients() {
//         return patientService.getAllPatients();
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
//         return patientService.getPatientById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     @GetMapping("/search/nom")
//     public List<Patient> getPatientsByNom(@RequestParam String nom) {
//         return patientService.getPatientsByNom(nom);
//     }

//     @GetMapping("/search/prenom")
//     public List<Patient> getPatientsByPrenom(@RequestParam String prenom) {
//         return patientService.getPatientsByPrenom(prenom);
//     }

//     @GetMapping("/search/nom-prenom")
//     public List<Patient> getPatientsByNomAndPrenom(@RequestParam String nom, @RequestParam String prenom) {
//         return patientService.getPatientsByNomAndPrenom(nom, prenom);
//     }

//   @PostMapping
//     public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
//         return ResponseEntity.ok(patientService.savePatient(patient));
//                 patient.setId(null);
//         Patient savedPatient = patientService.savePatient(patient);
        
//         // Construire l'URI de la ressource créée
//       }


//     @PutMapping("/{id}")
//     public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
//         try {
//             Patient updated = patientService.updatePatient(id, patientDetails);
//             return ResponseEntity.ok(updated);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
//         if (patientService.getPatientById(id).isPresent()) {
//             patientService.deletePatient(id);
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.notFound().build();
//         }
//     }
// }


package com.gestion_hospitaliere.UeEntreprise.controller.Medical;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.service.Medical.PatientService;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/nom")
    public List<Patient> getPatientsByNom(@RequestParam String nom) {
        return patientService.getPatientsByNom(nom);
    }

    @GetMapping("/search/prenom")
    public List<Patient> getPatientsByPrenom(@RequestParam String prenom) {
        return patientService.getPatientsByPrenom(prenom);
    }

    @GetMapping("/search/nom-prenom")
    public List<Patient> getPatientsByNomAndPrenom(@RequestParam String nom, @RequestParam String prenom) {
        return patientService.getPatientsByNomAndPrenom(nom, prenom);
    }

  @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        // La ligne ci-dessous a été supprimée car elle rendait le code suivant inaccessible.
        // return ResponseEntity.ok(patientService.savePatient(patient));
        
        // S'assurer que l'ID est null pour une nouvelle entité pour éviter les conflits
        // et permettre à la base de données de générer l'ID.
        patient.setId(null);
        Patient savedPatient = patientService.savePatient(patient);
        
        // Construire l'URI de la ressource créée
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedPatient.getId())
                .toUri();
        return ResponseEntity.created(location).body(savedPatient);
      }


    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        try {
            Patient updated = patientService.updatePatient(id, patientDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientService.getPatientById(id).isPresent()) {
            patientService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
