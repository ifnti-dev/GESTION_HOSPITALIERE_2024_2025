package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.PrescriptionPrenatal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescriptionPrenatalRepository extends JpaRepository<PrescriptionPrenatal, Long> {

    // Supprimé : findByConsultationId(Long consultationId)

    List<PrescriptionPrenatal> findByConsultationPrenatale_Id(Long id);


    List<PrescriptionPrenatal> findByPosologieContaining(String posologie);
}