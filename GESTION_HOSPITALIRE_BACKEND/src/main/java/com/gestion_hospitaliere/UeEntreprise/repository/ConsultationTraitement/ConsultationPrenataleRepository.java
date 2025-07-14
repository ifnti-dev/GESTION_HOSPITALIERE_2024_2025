package com.gestion_hospitaliere.UeEntreprise.repository.ConsultationTraitement;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;

@Repository
public interface ConsultationPrenataleRepository extends JpaRepository<ConsultationPrenatale, Long> {
}
