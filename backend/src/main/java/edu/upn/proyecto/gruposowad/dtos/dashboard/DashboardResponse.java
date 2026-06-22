package edu.upn.proyecto.gruposowad.dtos.dashboard;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    private long ventasTotales;
    private BigDecimal ingresosDia;
    private long productosStockBajo;
    private long totalProductos;
    private List<ChartPoint> ventasPorDia;
    private List<ChartPoint> metodosPago;
    private List<ChartPoint> productosMasVendidos;

    public DashboardResponse(long ventasTotales, BigDecimal ingresosDia, long productosStockBajo, long totalProductos,
            List<ChartPoint> ventasPorDia, List<ChartPoint> metodosPago, List<ChartPoint> productosMasVendidos) {
        this.ventasTotales = ventasTotales;
        this.ingresosDia = ingresosDia;
        this.productosStockBajo = productosStockBajo;
        this.totalProductos = totalProductos;
        this.ventasPorDia = ventasPorDia;
        this.metodosPago = metodosPago;
        this.productosMasVendidos = productosMasVendidos;
    }

    public long getVentasTotales() {
        return ventasTotales;
    }

    public BigDecimal getIngresosDia() {
        return ingresosDia;
    }

    public long getProductosStockBajo() {
        return productosStockBajo;
    }

    public long getTotalProductos() {
        return totalProductos;
    }

    public List<ChartPoint> getVentasPorDia() {
        return ventasPorDia;
    }

    public List<ChartPoint> getMetodosPago() {
        return metodosPago;
    }

    public List<ChartPoint> getProductosMasVendidos() {
        return productosMasVendidos;
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