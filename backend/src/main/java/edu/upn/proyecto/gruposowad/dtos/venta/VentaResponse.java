package edu.upn.proyecto.gruposowad.dtos.venta;

import java.math.BigDecimal;

public class VentaResponse {
    private Long idVenta;
    private Long idBoleta;
    private String numeroVenta;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private BigDecimal vuelto;

    public VentaResponse(Long idVenta, Long idBoleta, String numeroVenta, BigDecimal subtotal, BigDecimal igv, BigDecimal total, BigDecimal vuelto) {
        this.idVenta = idVenta;
        this.idBoleta = idBoleta;
        this.numeroVenta = numeroVenta;
        this.subtotal = subtotal;
        this.igv = igv;
        this.total = total;
        this.vuelto = vuelto;
    }

    public Long getIdVenta() {
        return idVenta;
    }

    public Long getIdBoleta() {
        return idBoleta;
    }

    public String getNumeroVenta() {
        return numeroVenta;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getIgv() {
        return igv;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getVuelto() {
        return vuelto;
    }
}
