package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByType(String type);
    List<Notification> findByDateNotif(LocalDate date);
    List<Notification> findByMessageContaining(String keyword);
}