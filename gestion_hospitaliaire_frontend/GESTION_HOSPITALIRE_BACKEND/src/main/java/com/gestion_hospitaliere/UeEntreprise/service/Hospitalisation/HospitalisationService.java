// package com.gestion_hospitaliere.UeEntreprise.service.Hospitalisation;

// import java.util.List;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.Hospitalisation;
// import com.gestion_hospitaliere.UeEntreprise.repository.hospitalisation.HospitalisationRepository;

// @Service


// public class HospitalisationService {

//     @Autowired
//     private HospitalisationRepository hospitalisationRepository;

//     public List<Hospitalisation> findAll() {
//         return hospitalisationRepository.findAll();
//     }

//     public Optional<Hospitalisation> findById(Long id) {
//         return hospitalisationRepository.findById(id);
//     }

//     public Hospitalisation save(Hospitalisation hospitalisation) {
//         return hospitalisationRepository.save(hospitalisation);
//     }

//     public void deleteById(Long id) {
//     	hospitalisationRepository.deleteById(id);
//     }
// }
