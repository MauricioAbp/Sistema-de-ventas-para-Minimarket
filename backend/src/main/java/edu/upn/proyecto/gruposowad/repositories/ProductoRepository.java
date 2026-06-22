package edu.upn.proyecto.gruposowad.repositories;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.upn.proyecto.gruposowad.models.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto,Long>{

    @Query("select p from Producto p where p.activo = true and (:q is null or lower(p.nombre_producto) like lower(concat('%', :q, '%')) or lower(p.codigo_producto) like lower(concat('%', :q, '%')))")
    List<Producto> buscarActivos(@Param("q") String q);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Producto p where p.id_producto = :id")
    Optional<Producto> buscarPorIdConBloqueo(@Param("id") Long id);

    @Query("select count(p) from Producto p where p.activo = true")
long contarActivos();

@Query("select count(p) from Producto p where p.activo = true and p.stock_actual <= p.stock_minimo")
long contarStockBajo();
}  
