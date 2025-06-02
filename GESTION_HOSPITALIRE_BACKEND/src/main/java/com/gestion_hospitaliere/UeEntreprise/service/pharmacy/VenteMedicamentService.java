package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.VenteMedicamentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class VenteMedicamentService {

    private final VenteMedicamentRepository venteRepository;

    public VenteMedicamentService(VenteMedicamentRepository venteRepository) {
        this.venteRepository = venteRepository;
    }

    public VenteMedicament createVente(VenteMedicament vente) {
        vente.setDateVente(LocalDate.now());
        return venteRepository.save(vente);
    }

    public VenteMedicament updateVente(Long id, VenteMedicament venteDetails) {
        VenteMedicament vente = venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));
        vente.setQuantite(venteDetails.getQuantite());
        vente.setMontantTotal(venteDetails.getMontantTotal());
        return venteRepository.save(vente);
    }

    public List<VenteMedicament> getAllVentes() {
        return venteRepository.findAll();
    }

    public VenteMedicament getVenteById(Long id) {
        return venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));
    }

    public void deleteVente(Long id) {
        venteRepository.deleteById(id);
    }

    public List<VenteMedicament> getVentesByPatient(Long patientId) {
        return venteRepository.findByPatientId(patientId);
    }

    public List<VenteMedicament> getVentesByCaissier(Long caissierId) {
        return venteRepository.findByCaissierId(caissierId);
    }

    public List<VenteMedicament> getVentesByPharmacien(Long pharmacienId) {
        return venteRepository.findByPharmacienId(pharmacienId);
    }

//  public List<VenteMedicament> getVentesBetweenDates(LocalDate startDate, LocalDate endDate) {
//        return venteRepository.findByDateVenteBetween(startDate, endDate);
//    }
//
//  public Double calculateChiffreAffaires(LocalDate startDate, LocalDate endDate) {
//        return venteRepository.calculateChiffreAffaires(startDate, endDate);
//    }
    

    
  
public VenteMedicament getVenteWithLignes(Long id) {
        return venteRepository.findByIdWithLignes(id);
}
    
    
}