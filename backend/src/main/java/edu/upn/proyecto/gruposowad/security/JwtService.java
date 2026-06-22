package edu.upn.proyecto.gruposowad.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService{
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(Usuario usuario, String rol){
        Date now = new Date();
        Date expiiration = new Date(now.getTime()+expirationMs);

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("idUsuario",usuario.getId_usuario())
                .claim("rol",rol)
                .issuedAt(now)
                .expiration(expiiration)
                .signWith(getKey())
                .compact();
    }

    public String extractUsername(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        
    }
}