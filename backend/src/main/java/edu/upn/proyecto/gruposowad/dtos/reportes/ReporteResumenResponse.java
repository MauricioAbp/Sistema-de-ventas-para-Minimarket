package edu.upn.proyecto.gruposowad.dtos.reportes;

import java.math.BigDecimal;
import java.util.List;

public class ReporteResumenResponse {
    private long ventasTotales;
    private BigDecimal ingresosTotales;
    private BigDecimal costosTotales;
    private BigDecimal gananciaNeta;
    private long numeroTransacciones;
    private List<ChartPoint> ventasPorDia;
    private List<ChartPoint> gananciasPorDia;
    private List<ChartPoint> metodosPago;

    public ReporteResumenResponse(long ventasTotales, BigDecimal ingresosTotales, BigDecimal costosTotales,
            BigDecimal gananciaNeta, long numeroTransacciones, List<ChartPoint> ventasPorDia,
            List<ChartPoint> gananciasPorDia, List<ChartPoint> metodosPago) {
        this.ventasTotales = ventasTotales;
        this.ingresosTotales = ingresosTotales;
        this.costosTotales = costosTotales;
        this.gananciaNeta = gananciaNeta;
        this.numeroTransacciones = numeroTransacciones;
        this.ventasPorDia = ventasPorDia;
        this.gananciasPorDia = gananciasPorDia;
        this.metodosPago = metodosPago;
    }

    public long getVentasTotales() {
        return ventasTotales;
    }

    public BigDecimal getIngresosTotales() {
        return ingresosTotales;
    }

    public BigDecimal getCostosTotales() {
        return costosTotales;
    }

    public BigDecimal getGananciaNeta() {
        return gananciaNeta;
    }

    public long getNumeroTransacciones() {
        return numeroTransacciones;
    }

    public List<ChartPoint> getVentasPorDia() {
        return ventasPorDia;
    }

    public List<ChartPoint> getGananciasPorDia() {
        return gananciasPorDia;
    }

    public List<ChartPoint> getMetodosPago() {
        return metodosPago;
    }

    public static class ChartPoint {
        private String label;
        private BigDecimal value;

        public ChartPoint(String label, BigDecimal value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public BigDecimal getValue() {
            return value;
        }
    }
}