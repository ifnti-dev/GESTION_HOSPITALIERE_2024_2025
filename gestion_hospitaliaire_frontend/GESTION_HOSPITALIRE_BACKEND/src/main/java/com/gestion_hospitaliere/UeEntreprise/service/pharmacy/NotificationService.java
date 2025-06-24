package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Notification;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.NotificationRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public List<Notification> getByType(String type) {
        return notificationRepository.findByType(type);
    }

    public List<Notification> getByDate(LocalDate date) {
        return notificationRepository.findByDateNotif(date);
    }

    public List<Notification> searchByMessageContaining(String keyword) {
        return notificationRepository.findByMessageContaining(keyword);
    }
}
