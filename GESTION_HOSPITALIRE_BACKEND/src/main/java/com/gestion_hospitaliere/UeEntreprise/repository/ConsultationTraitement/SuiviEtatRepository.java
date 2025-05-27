package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;



import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuiviEtatRepository extends JpaRepository<SuiviEtat, Long> {
    // Vous pouvez ajouter ici des méthodes de requête personnalisées si nécessaire.
    // Par exemple :
    /**
     * Trouve les SuiviEtat associés à une consultation spécifique (via son ID) et dont la date de suivi est postérieure à la date donnée.
     * REMPLACEZ 'votreChampConsultationDansSuiviEtat' par le nom réel du champ de type 'Consultation' dans votre entité SuiviEtat.
     * Par exemple, si SuiviEtat a "private Consultation consultation;", alors utilisez "findByConsultation_IdConsultation...".
     * Si SuiviEtat a "private Consultation maConsultation;", alors utilisez "findByMaConsultation_IdConsultation...".
     * Le champ 'IdConsultation' doit correspondre au nom du champ ID dans votre entité 'Consultation'.
     */
   //  List<SuiviEtat> findByVotreChampConsultationDansSuiviEtat_IdConsultationAndDateSuiviAfter(Long idConsultation, LocalDate date);
}
