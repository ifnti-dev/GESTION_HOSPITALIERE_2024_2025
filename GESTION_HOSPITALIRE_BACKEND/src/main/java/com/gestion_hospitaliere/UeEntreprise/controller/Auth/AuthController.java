package com.gestion_hospitaliere.UeEntreprise.controller.Auth;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.gestion_hospitaliere.UeEntreprise.config.JwtUtil;
import com.gestion_hospitaliere.UeEntreprise.model.dto.AuthRequest;
import com.gestion_hospitaliere.UeEntreprise.repository.User.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.service.UserDetailsService.CustomUserDetailsService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of("token", token));
    }
}
