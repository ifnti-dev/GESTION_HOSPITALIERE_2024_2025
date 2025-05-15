package com.gestion_hospitaliere.UeEntreprise.repository.hospitalisation;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;

public interface ServiceRepository extends JpaRepository<ServiceHopital, Long> {

}
