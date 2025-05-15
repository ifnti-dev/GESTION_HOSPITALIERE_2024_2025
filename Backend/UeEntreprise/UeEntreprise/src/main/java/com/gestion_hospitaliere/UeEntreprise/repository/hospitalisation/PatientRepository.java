package com.gestion_hospitaliere.UeEntreprise.repository.hospitalisation;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{

}
