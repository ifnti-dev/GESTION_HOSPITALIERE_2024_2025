// package com.gestion_hospitaliere.UeEntreprise.controller.Payments;

// import java.time.LocalDate;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
// import com.gestion_hospitaliere.UeEntreprise.service.Payments.FactureService;
// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import io.swagger.v3.oas.annotations.responses.ApiResponse;
// import io.swagger.v3.oas.annotations.responses.ApiResponses;
// import io.swagger.v3.oas.annotations.tags.Tag;

// @Tag(name = "Factures", description = "API pour la gestion des factures")
// @RestController
// @RequestMapping("/api/factures")
// public class FactureController {

//     @Autowired
//     private FactureService factureService;
    
//     @Operation(summary = "Récupérer toutes les factures", description = "Retourne une liste de toutes les factures enregistrées.")
//     @GetMapping
//     public List<Facture> getAllFactures() {
//         return factureService.getAllFactures();
//     }

//     @Operation(summary = "Récupérer une facture par son ID")
//     @ApiResponses(value = {
//             @ApiResponse(responseCode = "200", description = "Facture trouvée"),
//             @ApiResponse(responseCode = "404", description = "Facture non trouvée (si le service retourne null et que le contrôleur ne gère pas spécifiquement)")
//     })
//     @GetMapping("/{id}")
//     public Facture getFactureById(@Parameter(description = "ID de la facture à récupérer") @PathVariable("id") Long id) {
//         return factureService.getFactureById(id);
//     }
//     @Operation(summary = "Créer une nouvelle facture")
//     @PostMapping
//     public Facture createFacture(@RequestBody Facture facture) {
//         return factureService.createFacture(facture);
//     }
//     @Operation(summary = "Mettre à jour une facture existante")
//     @PutMapping("/{id}")
//     public Facture updateFacture(@PathVariable("id") Long id, @RequestBody Facture facture) {
//         return factureService.updateFacture(id, facture);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteFacture(@PathVariable("id") Long id) {
//         factureService.deleteFacture(id);
//     }
    
//     @Operation(summary = "Rechercher des factures par date")
//     @GetMapping("/date")
//     public List<Facture> findByDate(@RequestParam LocalDate date) {
//         return factureService.findByDate(date);
//     }
// }