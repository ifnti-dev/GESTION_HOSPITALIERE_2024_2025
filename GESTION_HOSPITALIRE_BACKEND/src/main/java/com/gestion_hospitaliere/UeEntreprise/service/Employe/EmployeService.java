package com.gestion_hospitaliere.UeEntreprise.service.Employe;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;

@Service
public class EmployeService {
	
	@Autowired
	private EmployeRepository employeRepository;
	
	// Créer un employe
	public Employe ajouterEmploye(Employe employe) {
        if (employe.getId() != null && employeRepository.existsById(employe.getId())) {
            throw new IllegalArgumentException("L'employé existe déjà. Utilisez mettreAjourEmploye pour mettre à jour.");
        }
        return employeRepository.save(employe);
    }
	
	// Obtenir tous les employés
	public List<Employe> recupererToutEmploye(){
		return employeRepository.findAll();
	}
	
	// Obtenir un employe
	public Optional<Employe> obtenirEmployParId(Long id){
		return employeRepository.findById(id);
	}
	
	// Effacé un employe
	public void deleteEmploye(Long id) {
		employeRepository.deleteById(id);
	}
	
	
	
	// 🔹 Mettre à jour un employé existant
    public Employe mettreAjourEmploye(Long id, Employe updatedEmploye) {
        Optional<Employe> existingEmployeOpt = employeRepository.findById(id);

        if (existingEmployeOpt.isEmpty()) {
            throw new IllegalArgumentException("Aucun employé trouvé avec l'ID : " + id);
        }

        Employe existingEmploye = existingEmployeOpt.get();

        // Met à jour uniquement les champs modifiables
        existingEmploye.setHoraire(updatedEmploye.getHoraire());
        existingEmploye.setDateAffectation(updatedEmploye.getDateAffectation());
        existingEmploye.setSpecialite(updatedEmploye.getSpecialite());
        existingEmploye.setNumOrdre(updatedEmploye.getNumOrdre());
        existingEmploye.setRoles(updatedEmploye.getRoles());

        return employeRepository.save(existingEmploye);
    }
    
    
    // 🔹 Vérifier l'existence
    public boolean existsById(Long id) {
        return employeRepository.existsById(id);
    }

}
