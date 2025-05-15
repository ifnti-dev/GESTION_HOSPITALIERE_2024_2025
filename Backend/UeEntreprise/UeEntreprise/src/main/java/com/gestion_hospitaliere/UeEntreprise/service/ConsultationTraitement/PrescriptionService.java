// package com.gestion_hospitaliere.UeEntreprise.service.ConsultationTraitement;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Prescription;
// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
// import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;
// import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.PrescriptionRepository;
// import com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement.ConsultationRepository;

// @Service
// public class PrescriptionService {

//     @Autowired
//     private PrescriptionRepository prescriptionRepository;

//     @Autowired
//     private ConsultationRepository consultationRepository;

//     @Autowired
//     private MedicamentRepository medicamentRepository;

//     public List<Prescription> getAllPrescriptions() {
//         return prescriptionRepository.findAll();
//     }

//     public Prescription getPrescriptionById(Long id) {
//         return prescriptionRepository.findById(id).orElse(null);
//     }

//     public Prescription createPrescription(Prescription prescription) {
//         Consultation consultation = consultationRepository.findById(prescription.getConsultation().getId())
//             .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));

//         Medicament medicament = medicamentRepository.findById(prescription.getMedicament().getId())
//             .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

//         prescription.setConsultation(consultation);
//         prescription.setMedicament(medicament);

//         return prescriptionRepository.save(prescription);
//     }

//     public Prescription updatePrescription(Long id, Prescription updatedPrescription) {
//         if (prescriptionRepository.existsById(id)) {
//             Consultation consultation = consultationRepository.findById(updatedPrescription.getConsultation().getId())
//                 .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));

//             Medicament medicament = medicamentRepository.findById(updatedPrescription.getMedicament().getId())
//                 .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

//             updatedPrescription.setId(id);
//             updatedPrescription.setConsultation(consultation);
//             updatedPrescription.setMedicament(medicament);

//             return prescriptionRepository.save(updatedPrescription);
//         }
//         return null;
//     }

//     public void deletePrescription(Long id) {
//         prescriptionRepository.deleteById(id);
//     }

//     public List<Prescription> findByConsultationId(Long consultationId) {
//         return prescriptionRepository.findByConsultationId(consultationId);
//     }

//     public List<Prescription> findByMedicamentId(Long medicamentId) {
//         return prescriptionRepository.findByMedicamentId(medicamentId);
//     }

//     public List<Prescription> findByPosologieContaining(String posologie) {
//         return prescriptionRepository.findByPosologieContaining(posologie);
//     }
// }
