package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.CommandeRepository; 
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande; 

@Service
public class CommandeService {
    private final CommandeRepository commandeRepository;

    public CommandeService(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id).orElse(null);
    }

    public Commande saveCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }

    public List<Commande> getCommandesByDate(LocalDate date) {
        return commandeRepository.findByDateCommande(date);
    }

    public List<Commande> getCommandesByPersonneId(Long personneId) {
        return commandeRepository.findByPersonneId(personneId);
    }

    public List<Commande> getCommandesByMontantGreaterThan(String montant) {
        return commandeRepository.findByMontantTotalGreaterThan(montant);
    }
}