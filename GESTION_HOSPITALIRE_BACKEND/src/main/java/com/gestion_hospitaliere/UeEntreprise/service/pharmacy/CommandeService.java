package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.CommandeRepository; 
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande; 

@Service
@Transactional
public class CommandeService {
  
  @Autowired
  private final CommandeRepository commandeRepository;

  public CommandeService(CommandeRepository commandeRepository) {
      this.commandeRepository = commandeRepository;
  }

  public List<Commande> getAllCommandes() {
      return commandeRepository.findAll();
  }

  public Optional<Commande> getCommandeById(Long id) {
      return commandeRepository.findById(id);
  }

  public Commande saveCommande(Commande commande) {
      // Calculer le montant total avant sauvegarde
      if (commande.getLignesCommande() != null && !commande.getLignesCommande().isEmpty()) {
          commande.calculerMontantTotal(); // Utilise la méthode de l'entité
      } else {
          commande.setMontantTotal("0.0");
      }
      
      // Définir la date de commande si elle n'est pas définie
      if (commande.getDateCommande() == null) {
          commande.setDateCommande(LocalDate.now());
      }
      
      return commandeRepository.save(commande);
  }

  public Commande updateCommande(Long id, Commande commande) {
      if (commandeRepository.existsById(id)) {
          commande.setId(id);
          return saveCommande(commande);
      }
      throw new RuntimeException("Commande non trouvée avec l'ID: " + id);
  }

  public void deleteCommande(Long id) {
      if (commandeRepository.existsById(id)) {
          commandeRepository.deleteById(id);
      } else {
          throw new RuntimeException("Commande non trouvée avec l'ID: " + id);
      }
  }

  public List<Commande> getCommandesByDate(LocalDate date) {
      return commandeRepository.findByDateCommande(date);
  }

  public List<Commande> getCommandesByPersonneId(Long personneId) {
      return commandeRepository.findByPersonneId(personneId);
  }

  // Méthode corrigée pour accepter String et convertir en Double
  public List<Commande> getCommandesByMontantGreaterThan(String montant) {
      try {
          Double montantDouble = Double.parseDouble(montant);
          return commandeRepository.findByMontantTotalGreaterThan(montantDouble);
      } catch (NumberFormatException e) {
          // Si la conversion échoue, utiliser la méthode String
          return commandeRepository.findByMontantTotalGreaterThanString(montant);
      }
  }
  
  // Méthode alternative avec Double directement
  public List<Commande> getCommandesByMontantGreaterThan(Double montant) {
      return commandeRepository.findByMontantTotalGreaterThan(montant);
  }

  public List<Commande> getCommandesByDateRange(LocalDate dateDebut, LocalDate dateFin) {
      return commandeRepository.findByDateCommandeBetween(dateDebut, dateFin);
  }

  public List<Commande> getCommandesByMontantRange(Double montantMin, Double montantMax) {
      return commandeRepository.findByMontantTotalBetween(montantMin, montantMax);
  }

  public List<Commande> getAllCommandesOrderByDateDesc() {
      return commandeRepository.findAllOrderByDateCommandeDesc();
  }

  public List<Commande> getCommandesByPersonneIdOrderByDateDesc(Long personneId) {
      return commandeRepository.findByPersonneIdOrderByDateCommandeDesc(personneId);
  }

  public List<Commande> searchCommandesByPersonneNom(String nom) {
      return commandeRepository.findByPersonneNomContaining(nom);
  }

  public List<Commande> getCommandesAujourdhui() {
      return commandeRepository.findCommandesAujourdhui();
  }

  public Long countCommandesAujourdhui() {
      return commandeRepository.countCommandesAujourdhui();
  }

  public Double getMontantTotalCommandesAujourdhui() {
      Double montant = commandeRepository.sumMontantCommandesAujourdhui();
      return montant != null ? montant : 0.0;
  }

  public List<Commande> getCommandesByMois(int annee, int mois) {
      return commandeRepository.findByMois(annee, mois);
  }

  public Long countCommandesByPersonne(Long personneId) {
      return commandeRepository.countByPersonneId(personneId);
  }

  public Double getMontantTotalByPersonne(Long personneId) {
      Double montant = commandeRepository.sumMontantByPersonneId(personneId);
      return montant != null ? montant : 0.0;
  }

  public boolean existsById(Long id) {
      return commandeRepository.existsById(id);
  }

  public long count() {
      return commandeRepository.count();
  }

  // Méthodes utilitaires
  public Commande createCommande(Commande commande) {
      commande.setId(null); // S'assurer que c'est une nouvelle commande
      return saveCommande(commande);
  }

  public void recalculerMontantTotal(Long commandeId) {
      Optional<Commande> optionalCommande = getCommandeById(commandeId);
      if (optionalCommande.isPresent()) {
          Commande commande = optionalCommande.get();
          commande.calculerMontantTotal();
          commandeRepository.save(commande);
      }
  }
}
