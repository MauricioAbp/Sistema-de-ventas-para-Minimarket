package edu.upn.proyecto.gruposowad.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.upn.proyecto.gruposowad.models.Caja;

public interface CajaRepository extends JpaRepository<Caja, Long> {

    @Query("select c from Caja c where c.usuario.id_usuario = :idUsuario and upper(c.estado) = upper(:estado) order by c.fecha_apertura desc")
    Optional<Caja> buscarCajaAbierta(@Param("idUsuario") Long idUsuario, @Param("estado") String estado);

    @Query("select c from Caja c where upper(c.estado) = upper(:estado) order by c.fecha_apertura desc")
    Optional<Caja> buscarCajaAbiertaGlobal(@Param("estado") String estado);
}