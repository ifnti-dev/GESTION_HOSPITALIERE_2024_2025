package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;
import java.time.LocalDate;
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

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.CommandeService;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping
    public List<Commande> getAllCommandes() {
        return commandeService.getAllCommandes();
    }

    @GetMapping("/{id}")
    public Commande getCommandeById(@PathVariable Long id) {
        return commandeService.getCommandeById(id);
    }

    @PostMapping
    public Commande createCommande(@RequestBody Commande commande) {
        return commandeService.saveCommande(commande);
    }

    @PutMapping("/{id}")
    public Commande updateCommande(@PathVariable Long id, @RequestBody Commande commande) {
        commande.setId(id);
        return commandeService.saveCommande(commande);
    }

    @DeleteMapping("/{id}")
    public void deleteCommande(@PathVariable Long id) {
        commandeService.deleteCommande(id);
    }

    @GetMapping("/by-date")
    public List<Commande> getCommandesByDate(@RequestParam LocalDate date) {
        return commandeService.getCommandesByDate(date);
    }

    @GetMapping("/by-personne/{personneId}")
    public List<Commande> getCommandesByPersonneId(@PathVariable Long personneId) {
        return commandeService.getCommandesByPersonneId(personneId);
    }

    @GetMapping("/by-montant")
    public List<Commande> getCommandesByMontantGreaterThan(@RequestParam String montant) {
        return commandeService.getCommandesByMontantGreaterThan(montant);
    }
}
