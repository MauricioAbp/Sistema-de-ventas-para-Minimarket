package edu.upn.proyecto.gruposowad.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.dtos.reportes.ReporteResumenResponse;
import edu.upn.proyecto.gruposowad.dtos.reportes.ReporteResumenResponse.ChartPoint;
import edu.upn.proyecto.gruposowad.repositories.VentaRepository;

@Service
public class ReporteService {
    private final VentaRepository ventaRepository;

    public ReporteService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public ReporteResumenResponse resumen(LocalDate desde, LocalDate hasta) {
        LocalDate safeDesde = desde == null ? LocalDate.now() : desde;
        LocalDate safeHasta = hasta == null ? safeDesde : hasta;

        LocalDateTime start = safeDesde.atStartOfDay();
        LocalDateTime end = safeHasta.plusDays(1).atStartOfDay().minusNanos(1);

        long transacciones = ventaRepository.contarCompletadasEntre(start, end);
        BigDecimal ingresos = ventaRepository.ingresosCompletadasEntre(start, end);
        BigDecimal costos = ventaRepository.costosEntre(start, end);
        BigDecimal ganancia = ingresos.subtract(costos);

        return new ReporteResumenResponse(
                transacciones,
                ingresos,
                costos,
                ganancia,
                transacciones,
                toChartPoints(ventaRepository.reporteVentasPorDia(start, end)),
                toChartPoints(ventaRepository.reporteGananciasPorDia(start, end)),
                toChartPoints(ventaRepository.reporteMetodosPago(start, end)));
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
