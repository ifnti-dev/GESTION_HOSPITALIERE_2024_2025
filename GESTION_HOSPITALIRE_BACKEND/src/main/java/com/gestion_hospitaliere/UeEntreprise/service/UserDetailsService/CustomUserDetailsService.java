package com.gestion_hospitaliere.UeEntreprise.service. UserDetailsService;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;



@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeRepository employeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employe employe = employeRepository.findByPersonneEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Employé non trouvé"));

        Set<GrantedAuthority> authorities = new HashSet<>();

        employe.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getNom()));
            role.getPermissions().forEach(perm ->
                authorities.add(new SimpleGrantedAuthority(perm.getNom()))
            );
        });

        return new org.springframework.security.core.userdetails.User(
                employe.getPersonne().getEmail(),
                employe.getPersonne().getPassword(),
                authorities
        );
    }
}
