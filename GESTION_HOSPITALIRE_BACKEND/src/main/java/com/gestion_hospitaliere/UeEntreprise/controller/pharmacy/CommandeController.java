package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.CommandeService;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

  @Autowired
  private CommandeService commandeService;

  @GetMapping
  public ResponseEntity<List<Commande>> getAllCommandes() {
      try {
          List<Commande> commandes = commandeService.getAllCommandes();
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
      try {
          Optional<Commande> commande = commandeService.getCommandeById(id);
          return commande.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @PostMapping
  public ResponseEntity<Commande> createCommande(@RequestBody Commande commande) {
      try {
          Commande nouvelleCommande = commandeService.createCommande(commande);
          return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleCommande);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Commande> updateCommande(@PathVariable Long id, @RequestBody Commande commande) {
      try {
          Commande commandeUpdated = commandeService.updateCommande(id, commande);
          return ResponseEntity.ok(commandeUpdated);
      } catch (RuntimeException e) {
          return ResponseEntity.notFound().build();
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
      try {
          commandeService.deleteCommande(id);
          return ResponseEntity.noContent().build();
      } catch (RuntimeException e) {
          return ResponseEntity.notFound().build();
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/date/{date}")
  public ResponseEntity<List<Commande>> getCommandesByDate(@PathVariable LocalDate date) {
      try {
          List<Commande> commandes = commandeService.getCommandesByDate(date);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/personne/{personneId}")
  public ResponseEntity<List<Commande>> getCommandesByPersonneId(@PathVariable Long personneId) {
      try {
          List<Commande> commandes = commandeService.getCommandesByPersonneId(personneId);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/montant-superieur/{montant}")
  public ResponseEntity<List<Commande>> getCommandesByMontantGreaterThan(@PathVariable String montant) {
      try {
          List<Commande> commandes = commandeService.getCommandesByMontantGreaterThan(montant);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/date-range")
  public ResponseEntity<List<Commande>> getCommandesByDateRange(
          @RequestParam LocalDate dateDebut,
          @RequestParam LocalDate dateFin) {
      try {
          List<Commande> commandes = commandeService.getCommandesByDateRange(dateDebut, dateFin);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/montant-range")
  public ResponseEntity<List<Commande>> getCommandesByMontantRange(
          @RequestParam Double montantMin,
          @RequestParam Double montantMax) {
      try {
          List<Commande> commandes = commandeService.getCommandesByMontantRange(montantMin, montantMax);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/ordered-by-date")
  public ResponseEntity<List<Commande>> getAllCommandesOrderByDateDesc() {
      try {
          List<Commande> commandes = commandeService.getAllCommandesOrderByDateDesc();
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/personne/{personneId}/ordered-by-date")
  public ResponseEntity<List<Commande>> getCommandesByPersonneIdOrderByDateDesc(@PathVariable Long personneId) {
      try {
          List<Commande> commandes = commandeService.getCommandesByPersonneIdOrderByDateDesc(personneId);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/search-by-nom")
  public ResponseEntity<List<Commande>> searchCommandesByPersonneNom(@RequestParam String nom) {
      try {
          List<Commande> commandes = commandeService.searchCommandesByPersonneNom(nom);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/aujourd-hui")
  public ResponseEntity<List<Commande>> getCommandesAujourdhui() {
      try {
          List<Commande> commandes = commandeService.getCommandesAujourdhui();
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/count-aujourd-hui")
  public ResponseEntity<Long> countCommandesAujourdhui() {
      try {
          Long count = commandeService.countCommandesAujourdhui();
          return ResponseEntity.ok(count);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/montant-total-aujourd-hui")
  public ResponseEntity<Double> getMontantTotalCommandesAujourdhui() {
      try {
          Double montant = commandeService.getMontantTotalCommandesAujourdhui();
          return ResponseEntity.ok(montant);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/mois/{annee}/{mois}")
  public ResponseEntity<List<Commande>> getCommandesByMois(@PathVariable int annee, @PathVariable int mois) {
      try {
          List<Commande> commandes = commandeService.getCommandesByMois(annee, mois);
          return ResponseEntity.ok(commandes);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/count-by-personne/{personneId}")
  public ResponseEntity<Long> countCommandesByPersonne(@PathVariable Long personneId) {
      try {
          Long count = commandeService.countCommandesByPersonne(personneId);
          return ResponseEntity.ok(count);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/montant-total-by-personne/{personneId}")
  public ResponseEntity<Double> getMontantTotalByPersonne(@PathVariable Long personneId) {
      try {
          Double montant = commandeService.getMontantTotalByPersonne(personneId);
          return ResponseEntity.ok(montant);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @PostMapping("/{id}/recalculer-montant")
  public ResponseEntity<Void> recalculerMontantTotal(@PathVariable Long id) {
      try {
          commandeService.recalculerMontantTotal(id);
          return ResponseEntity.ok().build();
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }

  @GetMapping("/count")
  public ResponseEntity<Long> count() {
      try {
          long count = commandeService.count();
          return ResponseEntity.ok(count);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }
}
