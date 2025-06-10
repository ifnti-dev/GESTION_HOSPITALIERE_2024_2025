package com.gestion_hospitaliere.UeEntreprise.repository.Employe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;


@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long>{

}
