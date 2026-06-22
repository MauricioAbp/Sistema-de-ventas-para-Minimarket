package edu.upn.proyecto.gruposowad.dtos.venta;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class VentaRequest {
    @NotNull(message = "La caja es obligatoria")
    private Long idCaja;

    @NotNull(message = "El usuario es obligatorio")
    private Long idUsuario;

    @NotEmpty(message = "La venta debe tener al menos un detalle")
    @Valid
    private List<VentaDetalleRequest> detalles;

    @NotNull(message = "El monto recibido es obligatorio")
    private BigDecimal montoRecibido;

    private String metodoPago;

    public Long getIdCaja() {
        return idCaja;
    }

    public void setIdCaja(Long idCaja) {
        this.idCaja = idCaja;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<VentaDetalleRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<VentaDetalleRequest> detalles) {
        this.detalles = detalles;
    }

    public BigDecimal getMontoRecibido() {
        return montoRecibido;
    }

    public void setMontoRecibido(BigDecimal montoRecibido) {
        this.montoRecibido = montoRecibido;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
