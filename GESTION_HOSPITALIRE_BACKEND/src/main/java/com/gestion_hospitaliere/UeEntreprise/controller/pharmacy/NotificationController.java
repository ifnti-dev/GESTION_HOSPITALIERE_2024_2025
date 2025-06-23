package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy; 

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.NotificationService;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Notification;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.saveNotification(notification);
    }

    @PutMapping("/{id}")
    public Notification updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        notification.setId(id);
        return notificationService.saveNotification(notification);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }

    @GetMapping("/by-type")
    public List<Notification> getByType(@RequestParam String type) {
        return notificationService.getByType(type);
    }

    @GetMapping("/by-date")
    public List<Notification> getByDate(@RequestParam LocalDate date) {
        return notificationService.getByDate(date);
    }

    @GetMapping("/search/message")
    public List<Notification> searchByMessageContaining(@RequestParam String keyword) {
        return notificationService.searchByMessageContaining(keyword);
    }
}