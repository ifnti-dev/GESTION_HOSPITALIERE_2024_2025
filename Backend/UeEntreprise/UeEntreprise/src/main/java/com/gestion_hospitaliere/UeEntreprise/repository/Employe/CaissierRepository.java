package com.gestion_hospitaliere.UeEntreprise.repository.Employe;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CaissierRepository extends JpaRepository<Caissier, Long> {

    // Trouver les caissiers actifs
    List<Caissier> findByActif(Boolean actif);

    // Trouver les caissiers par horaires de travail
    List<Caissier> findByHorairesTravail(String horairesTravail);

    // Trouver les caissiers affectés après une certaine date
    List<Caissier> findByDateDebutAffectationAfter(LocalDate date);

    // Requête JPQL pour trouver les caissiers actifs
    @Query("SELECT c FROM Caissier c WHERE c.actif = :actif")
    List<Caissier> findActiveCaissiers(@Param("actif") Boolean actif);

    // Requête native pour trouver par horaires
    @Query(value = "SELECT * FROM caissier WHERE horaires_travail = :horaires", nativeQuery = true)
    List<Caissier> findByHorairesTravailNative(@Param("horaires") String horairesTravail);

    // Pagination pour les caissiers actifs
    Page<Caissier> findByActif(Boolean actif, Pageable pageable);
}
