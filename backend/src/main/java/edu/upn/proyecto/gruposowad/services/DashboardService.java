package edu.upn.proyecto.gruposowad.services;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.dtos.dashboard.DashboardResponse;
import edu.upn.proyecto.gruposowad.dtos.dashboard.DashboardResponse.ChartPoint;
import edu.upn.proyecto.gruposowad.repositories.ProductoRepository;
import edu.upn.proyecto.gruposowad.repositories.VentaRepository;

@Service
public class DashboardService {
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public DashboardService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    public DashboardResponse resumen() {
        LocalDate today = LocalDate.now();
        LocalDateTime startToday = today.atStartOfDay();
        LocalDateTime endToday = today.plusDays(1).atStartOfDay().minusNanos(1);
        LocalDateTime startWeek = today.minusDays(6).atStartOfDay();

long ventasTotales = ventaRepository.ventasEntre(startToday, endToday);        BigDecimal ingresosDia = ventaRepository.ingresosEntre(startToday, endToday);
        long stockBajo = productoRepository.contarStockBajo();
        long totalProductos = productoRepository.contarActivos();
        return new DashboardResponse(
                ventasTotales,
                ingresosDia,
                stockBajo,
                totalProductos,
                toChartPoints(ventaRepository.ventasPorDia(startWeek)),
                toChartPoints(ventaRepository.metodosPago(startWeek)),
                toChartPoints(ventaRepository.productosMasVendidos(startWeek)));
    }

    private List<ChartPoint> toChartPoints(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new ChartPoint(String.valueOf(row[0]), toBigDecimal(row[1])))
                .toList();
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal bd) {
            return bd;
        }

        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }

        return new BigDecimal(String.valueOf(value));
    }
}