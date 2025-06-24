package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;


import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String message;
    private LocalDate dateNotif;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public LocalDate getDateNotif() {
		return dateNotif;
	}
	public void setDateNotif(LocalDate dateNotif) {
		this.dateNotif = dateNotif;
	}
    
    
}
