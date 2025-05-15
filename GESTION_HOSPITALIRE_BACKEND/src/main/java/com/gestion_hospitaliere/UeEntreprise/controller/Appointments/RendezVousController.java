// package com.gestion_hospitaliere.UeEntreprise.controller.Appointments;

// import java.time.LocalDateTime;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
// import com.gestion_hospitaliere.UeEntreprise.service.Appointments.RendezVousService;

// @RestController
// @RequestMapping("/api/rendezvous")
// public class RendezVousController {

//     @Autowired
//     private RendezVousService rendezVousService;

//     @GetMapping
//     public List<RendezVous> getAllRendezVous() {
//         return rendezVousService.getAllRendezVous();
//     }

//     @GetMapping("/{id}")
//     public RendezVous getRendezVousById(@PathVariable Long id) {
//         return rendezVousService.getRendezVousById(id);
//     }

//     @PostMapping
//     public RendezVous createRendezVous(@RequestBody RendezVous rendezVous) {
//         return rendezVousService.createRendezVous(rendezVous);
//     }

//     @PutMapping("/{id}")
//     public RendezVous updateRendezVous(@PathVariable Long id, @RequestBody RendezVous rendezVous) {
//         return rendezVousService.updateRendezVous(id, rendezVous);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteRendezVous(@PathVariable Long id) {
//         rendezVousService.deleteRendezVous(id);
//     }

//     @GetMapping("/statut/{statut}")
//     public List<RendezVous> findByStatut(@PathVariable String statut) {
//         return rendezVousService.findByStatut(statut);
//     }

//     @GetMapping("/daterange")
//     public List<RendezVous> findByDateRange(@RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
//         return rendezVousService.findByDateRange(startDate, endDate);
//     }
// }