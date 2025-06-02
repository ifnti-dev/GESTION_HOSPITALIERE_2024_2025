package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Fournisseur;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    // Trouver un fournisseur par nom
    Fournisseur findByNom(String nom);
}
