package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.FactureRepository;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture getFactureById(Long id) {
        return factureRepository.findById(id).orElse(null);
    }

    public Facture createFacture(Facture facture) {
        return factureRepository.save(facture);
    }

    public Facture updateFacture(Long id, Facture updatedFacture) {
        if (factureRepository.existsById(id)) {
            updatedFacture.setId(id);
            return factureRepository.save(updatedFacture);
        }
        return null;
    }

    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> findByDate(LocalDate date) {
        return factureRepository.findByDate(date);
    }
}