package com.gestion_hospitaliere.UeEntreprise.repository.Employe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Infirmier;


@Repository
public interface InfirmierRepository extends JpaRepository<Infirmier, Long> {
}
