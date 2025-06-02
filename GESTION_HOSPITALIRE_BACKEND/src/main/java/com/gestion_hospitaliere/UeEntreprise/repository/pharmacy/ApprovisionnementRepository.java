package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Approvisionnement;

public interface ApprovisionnementRepository extends JpaRepository<Approvisionnement, Long> {
    // Trouver les approvisionnements par fournisseur
    List<Approvisionnement> findByFournisseurId(Long fournisseurId);
}
