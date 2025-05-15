package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;

// Assurez-vous que le chemin d'importation vers votre entité Prescription est correct.
// En se basant sur ConsultationRepository, elle pourrait être dans com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// L'annotation @Repository est optionnelle si vous utilisez une version récente de Spring Boot
// et que le repository est dans un package scanné, mais elle est souvent ajoutée pour la clarté.
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    // Vous pouvez ajouter ici des méthodes de requête personnalisées si nécessaire.
    // Par exemple :
    // List<Prescription> findByConsultationId(Long consultationId);
}
