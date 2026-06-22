package edu.upn.proyecto.gruposowad.repositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.upn.proyecto.gruposowad.models.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Query("select count(v) from Venta v where v.fecha_venta between :start and :end and v.estado = 'COMPLETADA'")
    long ventasEntre(LocalDateTime start, LocalDateTime end);

    @Query("select coalesce(sum(v.total), 0) from Venta v where v.fecha_venta between :start and :end and v.estado = 'COMPLETADA'")
    BigDecimal ingresosEntre(LocalDateTime start, LocalDateTime end);

    @Query(value = """
            select date(fecha_venta) as label, coalesce(sum(total), 0) as value
            from venta
            where fecha_venta >= :start
            and upper(estado) = 'COMPLETADA'
            group by date(fecha_venta)
            order by date(fecha_venta)
            """, nativeQuery = true)
    List<Object[]> ventasPorDia(LocalDateTime start);

    @Query(value = """
            select coalesce(metodo_pago, 'NO_ESPECIFICADO') as label, coalesce(sum(total), 0) as value
            from venta
            where fecha_venta >= :start
            and upper(estado) = 'COMPLETADA'
            group by metodo_pago
            order by value desc
            """, nativeQuery = true)
    List<Object[]> metodosPago(LocalDateTime start);

    @Query(value = """
            select p.nombre_producto as label, coalesce(sum(dv.cantidad), 0) as value
            from detalle_venta dv
            join producto p on p.id_producto = dv.id_producto
            join venta v on v.id_venta = dv.id_venta
            where v.fecha_venta >= :start
            and upper(v.estado) = 'COMPLETADA'
            group by p.nombre_producto
            order by value desc
            limit 5
            """, nativeQuery = true)
    List<Object[]> productosMasVendidos(LocalDateTime start);

    @Query(value = """
            select coalesce(sum(total), 0)
            from venta
            where id_caja = :idCaja
            and upper(estado) = 'COMPLETADA'
            """, nativeQuery = true)
    BigDecimal totalVendidoPorCaja(Long idCaja);

    @Query(value = """
            select coalesce(sum(total), 0)
            from venta
            where id_caja = :idCaja
            and upper(estado) = 'COMPLETADA'
            and upper(metodo_pago) = 'EFECTIVO'
            """, nativeQuery = true)
    BigDecimal totalEfectivoPorCaja(Long idCaja);

    @Query(value = """
            select coalesce(metodo_pago, 'NO_ESPECIFICADO') as metodo,
                   coalesce(sum(total), 0) as total
            from venta
            where id_caja = :idCaja
            and upper(estado) = 'COMPLETADA'
            group by metodo_pago
            """, nativeQuery = true)
    List<Object[]> ventasPorMetodoCaja(Long idCaja);

    @Query("select count(v) from Venta v where v.fecha_venta between :start and :end and v.estado = 'COMPLETADA'")
    long contarCompletadasEntre(LocalDateTime start, LocalDateTime end);

    @Query("select coalesce(sum(v.total), 0) from Venta v where v.fecha_venta between :start and :end and v.estado = 'COMPLETADA'")
    BigDecimal ingresosCompletadasEntre(LocalDateTime start, LocalDateTime end);

    @Query(value = """
            select coalesce(sum(dv.precio_compra * dv.cantidad), 0)
            from detalle_venta dv
            join venta v on v.id_venta = dv.id_venta
            where v.fecha_venta between :start and :end
            and upper(v.estado) = 'COMPLETADA'
            """, nativeQuery = true)
    BigDecimal costosEntre(LocalDateTime start, LocalDateTime end);

    @Query(value = """
            select date(v.fecha_venta) as label, coalesce(sum(v.total), 0) as value
            from venta v
            where v.fecha_venta between :start and :end
            and upper(v.estado) = 'COMPLETADA'
            group by date(v.fecha_venta)
            order by date(v.fecha_venta)
            """, nativeQuery = true)
    List<Object[]> reporteVentasPorDia(LocalDateTime start, LocalDateTime end);

    @Query(value = """
            select date(v.fecha_venta) as label,
                   coalesce(sum(dv.subtotal - (dv.precio_compra * dv.cantidad)), 0) as value
            from venta v
            join detalle_venta dv on dv.id_venta = v.id_venta
            where v.fecha_venta between :start and :end
            and upper(v.estado) = 'COMPLETADA'
            group by date(v.fecha_venta)
            order by date(v.fecha_venta)
            """, nativeQuery = true)
    List<Object[]> reporteGananciasPorDia(LocalDateTime start, LocalDateTime end);

    @Query(value = """
            select coalesce(v.metodo_pago, 'NO_ESPECIFICADO') as label, coalesce(sum(v.total), 0) as value
            from venta v
            where v.fecha_venta between :start and :end
            and upper(v.estado) = 'COMPLETADA'
            group by v.metodo_pago
            order by value desc
            """, nativeQuery = true)
    List<Object[]> reporteMetodosPago(LocalDateTime start, LocalDateTime end);
}