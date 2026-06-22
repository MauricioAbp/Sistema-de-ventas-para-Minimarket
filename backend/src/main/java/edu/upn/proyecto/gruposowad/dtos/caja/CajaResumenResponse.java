package edu.upn.proyecto.gruposowad.dtos.caja;

import java.math.BigDecimal;
import java.util.Map;

public class CajaResumenResponse {
    private Long idCaja;
    private String estado;
    private BigDecimal montoApertura;
    private BigDecimal totalVendido;
    private BigDecimal totalEfectivo;
    private BigDecimal montoEsperado;
    private Map<String, BigDecimal> ventasPorMetodo;

    public CajaResumenResponse(Long idCaja, String estado, BigDecimal montoApertura, BigDecimal totalVendido,
            BigDecimal totalEfectivo, BigDecimal montoEsperado, Map<String, BigDecimal> ventasPorMetodo) {
        this.idCaja = idCaja;
        this.estado = estado;
        this.montoApertura = montoApertura;
        this.totalVendido = totalVendido;
        this.totalEfectivo = totalEfectivo;
        this.montoEsperado = montoEsperado;
        this.ventasPorMetodo = ventasPorMetodo;
    }

    public Long getIdCaja() {
        return idCaja;
    }

    public String getEstado() {
        return estado;
    }

    public BigDecimal getMontoApertura() {
        return montoApertura;
    }

    public BigDecimal getTotalVendido() {
        return totalVendido;
    }

    public BigDecimal getTotalEfectivo() {
        return totalEfectivo;
    }

    public BigDecimal getMontoEsperado() {
        return montoEsperado;
    }

    public Map<String, BigDecimal> getVentasPorMetodo() {
        return ventasPorMetodo;
    }
}