package com.gestion_hospitaliere.UeEntreprise.service.Appointments;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.repository.Appointments.RendezVousRepository;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    public List<RendezVous> getAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    public RendezVous getRendezVousById(Long id) {
        return rendezVousRepository.findById(id).orElse(null);
    }

    public RendezVous createRendezVous(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous updateRendezVous(Long id, RendezVous updatedRendezVous) {
        if (rendezVousRepository.existsById(id)) {
            updatedRendezVous.setId(id);
            return rendezVousRepository.save(updatedRendezVous);
        }
        return null;
    }

    public void deleteRendezVous(Long id) {
        rendezVousRepository.deleteById(id);
    }

    public List<RendezVous> findByStatut(String statut) {
        return rendezVousRepository.findByStatut(statut);
    }

    public List<RendezVous> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return rendezVousRepository.findByDateHeureBetween(startDate, endDate);
    }
}