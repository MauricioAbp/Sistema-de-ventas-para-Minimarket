package edu.upn.proyecto.gruposowad.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(JwtAuthFilter jwtAuthFilter){
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
        return http
                .csrf(csrf->csrf.disable())
                .cors(cors->{})
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth->auth
                    .requestMatchers("/usuario/login").permitAll()
                    .requestMatchers("/venta/*/anular").hasRole("ADMIN")
                    .requestMatchers("/venta/pos","/caja/**","/boleta/**").hasAnyRole("ADMIN","CAJERO")
                    .requestMatchers("/producto").hasAnyRole("ADMIN", "CAJERO")
                        .requestMatchers("/producto/**").hasRole("ADMIN")
                        .requestMatchers("/categoria/**", "/proveedor/**", "/empresa/**").hasRole("ADMIN")
                        .requestMatchers("/movimientoinventario/**", "/anulacion_venta/**").hasRole("ADMIN")
                        .requestMatchers("/dashboard/**").hasAnyRole("ADMIN", "CAJERO")
                        .requestMatchers("/reportes/**").hasRole("ADMIN")
                        .requestMatchers("/empresa/**").hasRole("ADMIN")
                        .requestMatchers("/movimientoinventario/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                        
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
