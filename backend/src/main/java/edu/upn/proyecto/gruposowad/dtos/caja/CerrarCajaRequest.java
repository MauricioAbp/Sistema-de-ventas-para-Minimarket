package edu.upn.proyecto.gruposowad.dtos.caja;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class CerrarCajaRequest {
    @NotNull(message = "El monto contado es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto contado no puede ser negativo")
    private BigDecimal montoContado;

    private String observaciones;

    public BigDecimal getMontoContado() {
        return montoContado;
    }

    public void setMontoContado(BigDecimal montoContado) {
        this.montoContado = montoContado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
