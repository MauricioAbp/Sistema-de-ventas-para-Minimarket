package edu.upn.proyecto.gruposowad.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.upn.proyecto.gruposowad.models.DetalleRecepcion;

@Repository
public interface DetalleRecepcionRepository extends JpaRepository<DetalleRecepcion,Long> {

    
} 