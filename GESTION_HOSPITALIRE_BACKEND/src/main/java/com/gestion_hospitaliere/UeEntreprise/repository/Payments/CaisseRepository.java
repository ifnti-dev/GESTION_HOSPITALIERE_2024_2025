package com.gestion_hospitaliere.UeEntreprise.repository.Payments;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;

@Repository
public interface CaisseRepository extends JpaRepository<Caisse, Long> {

    // // Trouver les caisses actives
    // List<Caisse> findByActive(Boolean active);
}