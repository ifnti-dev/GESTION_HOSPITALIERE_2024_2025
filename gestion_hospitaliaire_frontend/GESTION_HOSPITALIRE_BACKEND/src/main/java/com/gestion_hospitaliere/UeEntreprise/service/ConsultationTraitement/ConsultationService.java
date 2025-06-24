// package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;
// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
// import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
 
// import java.util.List;
// import java.util.Optional;

// @Service
// public class ConsultationService {
//     // @Autowired is redundant here due to constructor injection
//     private final ConsultationRepository consultationRepository; 

  
//     public ConsultationService(ConsultationRepository consultationRepository) {
//         this.consultationRepository = consultationRepository;
//     }


//     public List<Consultation> getAllConsultations() {
//         return consultationRepository.findAll();
//     }


//     public Optional<Consultation> getConsultationById(Long id) {
//         return consultationRepository.findById(id);
//     }

//     @Transactional
//     public Consultation saveConsultation(Consultation consultation) {
//         // Ensure bidirectional relationship is set for prescriptions
//         if (consultation.getPrescriptions() != null) {
//             for (Prescription prescription : consultation.getPrescriptions()) {
//                 prescription.setConsultation(consultation);
//             }
//         }

//         return consultationRepository.save(consultation);
//     }

//     @Transactional
//     public Consultation updateConsultation(Long id, Consultation consultationDetails) {
//         // Vérifier si la consultation existe avant de la mettre à jour
//         Consultation existingConsultation = consultationRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Consultation non trouvée avec l'id : " + id)); // Replace with ResourceNotFoundException

//         // Mettre à jour les champs de l'entité existante
//         existingConsultation.setDate(consultationDetails.getDate());
//         existingConsultation.setSymptomes(consultationDetails.getSymptomes());
//         existingConsultation.setDiagnostic(consultationDetails.getDiagnostic());

//         // Handle Patient update (if ID is provided in consultationDetails)
//         if (consultationDetails.getPatient() != null && consultationDetails.getPatient().getId() != null) {
        
//             existingConsultation.setPatient(consultationDetails.getPatient());
//         }

     
//         if (consultationDetails.getPrescriptions() != null) {
//             existingConsultation.getPrescriptions().clear();
//             for (Prescription prescriptionDetail : consultationDetails.getPrescriptions()) {
//                 prescriptionDetail.setConsultation(existingConsultation); // Set bidirectional link
//                 existingConsultation.getPrescriptions().add(prescriptionDetail);
//             }
//         }

//         return consultationRepository.save(existingConsultation);
//     }
//     @Transactional
//     public void deleteConsultation(Long id) {
//         if (!consultationRepository.existsById(id)) {
//             throw new RuntimeException("Consultation non trouvée avec l'id : " + id + " pour la suppression."); // Replace with ResourceNotFoundException
//         }
//         consultationRepository.deleteById(id);
//     }
// }

