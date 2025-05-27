package com.gestion_hospitaliere.UeEntreprise.service.Medical;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.DossierGrossesseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Medical.PatientRepository;

@Service
public class DossierGrossesseService {

    @Autowired
    private DossierGrossesseRepository dossierGrossesseRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<DossierGrossesse> getAll() {
        return dossierGrossesseRepository.findAll();
    }

    public Optional<DossierGrossesse> getById(Long id) {
        return dossierGrossesseRepository.findById(id);
    }

    public Optional<DossierGrossesse> getByPatientId(Long patientId) {
        return dossierGrossesseRepository.findByPatientId(patientId);
    }

    public DossierGrossesse create(DossierGrossesse dossier) {
        Long patientId = dossier.getPatient().getId();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + patientId));
        dossier.setPatient(patient);
        return dossierGrossesseRepository.save(dossier);
    }

    public DossierGrossesse update(Long id, DossierGrossesse updated) {
        if (!dossierGrossesseRepository.existsById(id)) {
            throw new RuntimeException("DossierGrossesse non trouvé avec l'id: " + id);
        }
        Long patientId = updated.getPatient().getId();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + patientId));
        updated.setId(id);
        updated.setPatient(patient);
        return dossierGrossesseRepository.save(updated);
    }

    public void delete(Long id) {
        dossierGrossesseRepository.deleteById(id);
    }
}