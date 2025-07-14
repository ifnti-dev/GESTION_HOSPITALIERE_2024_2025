package com.gestion_hospitaliere.UeEntreprise.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.gestion_hospitaliere.UeEntreprise.service.UserDetailsService.CustomUserDetailsService;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // URLs publiques qui ne nécessitent pas d'authentification
    private final List<String> publicUrls = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/swagger-ui",
        "/v3/api-docs",
        "/actuator",
        "/api/personnes"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("JwtFilter - URL: " + requestPath);
        System.out.println("JwtFilter - Method: " + method);

        // Vérifier si l'URL est publique
        boolean isPublicUrl = publicUrls.stream().anyMatch(requestPath::startsWith);
        
        if (isPublicUrl) {
            System.out.println("URL publique détectée, passage du filtre JWT");
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        System.out.println("JwtFilter - Authorization Header: " + (authorizationHeader != null ? "Present" : "Absent"));

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            System.out.println("Token brut reçu: " + token.substring(0, Math.min(20, token.length())) + "...");
            
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("Username extrait: " + username);
            } catch (ExpiredJwtException e) {
                System.err.println("Token expiré: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token expiré\"}");
                return;
            } catch (MalformedJwtException e) {
                System.err.println("Token malformé: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token invalide\"}");
                return;
            } catch (SignatureException e) {
                System.err.println("Signature invalide: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Signature invalide\"}");
                return;
            } catch (Exception e) {
                System.err.println("Erreur lors de l'extraction du nom d'utilisateur: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Erreur d'authentification\"}");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, userDetails)) {
                    System.out.println("Token valide pour l'utilisateur: " + username);
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.err.println("Token invalide pour l'utilisateur: " + username);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Token invalide\"}");
                    return;
                }
            } catch (Exception e) {
                System.err.println("Erreur lors de la validation de l'utilisateur: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Utilisateur invalide\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
