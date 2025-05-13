package com.gestion_hospitaliere.UeEntreprise.repository.consultationTraitement;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// L'annotation @Repository est optionnelle si vous utilisez une version récente de Spring Boot
// et que le repository est dans un package scanné, mais elle est souvent ajoutée pour la clarté.
@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    // Vous pouvez ajouter ici des méthodes de requête personnalisées si nécessaire.
    // Par exemple :
    // List<Consultation> findByPatientId(Long patientId);
}
