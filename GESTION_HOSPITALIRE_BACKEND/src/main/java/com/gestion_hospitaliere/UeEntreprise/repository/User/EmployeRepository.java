package com.gestion_hospitaliere.UeEntreprise.repository.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long>{

}
