package com.gestion_hospitaliere.UeEntreprise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class UeEntrepriseApplication {

	public static void main(String[] args) {
		SpringApplication.run(UeEntrepriseApplication.class, args);
	}
}
