package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;


import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// L'annotation @Repository est optionnelle si vous utilisez une version récente de Spring Boot
// et que le repository est dans un package scanné, mais elle est souvent ajoutée pour la clarté.


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    // Trouver les prescriptions par consultation ID
    List<Prescription> findByConsultationId(Long consultationId);
    
    // Trouver les prescriptions par médicament ID
    
    // Trouver les prescriptions par quantité
    List<Prescription> findByQuantite(Integer quantite);
    
    // Trouver les prescriptions par posologie
    List<Prescription> findByPosologieContaining(String posologie);

    List<Prescription> findByConsultation_Id(Long id);

}

