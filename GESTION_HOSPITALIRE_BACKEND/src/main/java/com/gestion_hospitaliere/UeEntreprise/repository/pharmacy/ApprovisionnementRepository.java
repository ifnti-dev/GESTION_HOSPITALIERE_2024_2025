package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Approvisionnement;


@Repository
public interface ApprovisionnementRepository extends JpaRepository<Approvisionnement, Long> {
    List<Approvisionnement> findByDateAppro(LocalDate date);
    List<Approvisionnement> findByFournisseur(String fournisseur);
    List<Approvisionnement> findByEmployeId(Long employeId);
}
