package com.gestion_hospitaliere.UeEntreprise.service.Hospitalisation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;
import com.gestion_hospitaliere.UeEntreprise.repository.hospitalisation.ServiceRepository;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceHopital> findAll() {
        return serviceRepository.findAll();
    }

    public Optional<ServiceHopital> findById(Long id) {
        return serviceRepository.findById(id);
    }

    public ServiceHopital save(ServiceHopital service) { // Correction ici
        return serviceRepository.save(service);
    }

    public void deleteById(Long id) {
        serviceRepository.deleteById(id);
    }
}