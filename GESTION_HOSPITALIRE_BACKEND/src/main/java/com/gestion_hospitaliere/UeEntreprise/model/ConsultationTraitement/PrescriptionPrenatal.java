package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;




import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class PrescriptionPrenatal {
    
    public enum TypePrescription {
        MEDICAMENT,
        EXAMEN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "consultation_prenatale")
     // ou @JsonBackReference si ConsultationPrenatale utilise @JsonManagedReference
    private ConsultationPrenatale consultationPrenatale;

    
	public ConsultationPrenatale getConsultationPrenatale() {
        return consultationPrenatale;
    }
    public void setConsultationPrenatale(ConsultationPrenatale consultationPrenatale) {
        this.consultationPrenatale = consultationPrenatale;
    }
    // Type de prescription avec enum
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePrescription type;
    
    // Détails communs
    private String designation; // Nom du médicament ou type d'examen
    private String instructions;
    private String commentaire;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    
    // Champs spécifiques aux médicaments
    private String posologie; // Ex: "1 comprimé 3 fois/jour"
    private Integer quantiteParJour;
    private Integer dureeJours;
    
    // Champs spécifiques aux examens
    private LocalDate datePrevue;
    private String lieuRealisation;
    
    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    
    public TypePrescription getType() { return type; }
    public void setType(TypePrescription type) { this.type = type; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getPosologie() { return posologie; }
    public void setPosologie(String posologie) { this.posologie = posologie; }

    public Integer getQuantiteParJour() { return quantiteParJour; }
    public void setQuantiteParJour(Integer quantiteParJour) { this.quantiteParJour = quantiteParJour; }

    public Integer getDureeJours() { return dureeJours; }
    public void setDureeJours(Integer dureeJours) { this.dureeJours = dureeJours; }

    public LocalDate getDatePrevue() { return datePrevue; }
    public void setDatePrevue(LocalDate datePrevue) { this.datePrevue = datePrevue; }

    public String getLieuRealisation() { return lieuRealisation; }
    public void setLieuRealisation(String lieuRealisation) { this.lieuRealisation = lieuRealisation; }
}
