package edu.upn.proyecto.gruposowad.dtos.venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import edu.upn.proyecto.gruposowad.models.Usuario;
import edu.upn.proyecto.gruposowad.models.Venta;

public class VentaHistorialResponse {
    private Long id_venta;
    private String numero_venta;
    private LocalDateTime fecha_venta;
    private String metodo_pago;
    private BigDecimal total;
    private String estado;
    private UsuarioResumen usuario;

    public VentaHistorialResponse(Venta venta) {
        this.id_venta = venta.getId_venta();
        this.numero_venta = venta.getNumero_venta();
        this.fecha_venta = venta.getFecha_venta();
        this.metodo_pago = venta.getMetodo_pago();
        this.total = venta.getTotal();
        this.estado = venta.getEstado();
        this.usuario = venta.getUsuario() == null ? null : new UsuarioResumen(venta.getUsuario());
    }

    public Long getId_venta() {
        return id_venta;
    }

    public String getNumero_venta() {
        return numero_venta;
    }

    public LocalDateTime getFecha_venta() {
        return fecha_venta;
    }

    public String getMetodo_pago() {
        return metodo_pago;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getEstado() {
        return estado;
    }

    public UsuarioResumen getUsuario() {
        return usuario;
    }

    public static class UsuarioResumen {
        private Long id_usuario;
        private String nombre;
        private String apellido;
        private String username;

        public UsuarioResumen(Usuario usuario) {
            this.id_usuario = usuario.getId_usuario();
            this.nombre = usuario.getNombre();
            this.apellido = usuario.getApellido();
            this.username = usuario.getUsername();
        }

        public Long getId_usuario() {
            return id_usuario;
        }

        public String getNombre() {
            return nombre;
        }

        public String getApellido() {
            return apellido;
        }

        public String getUsername() {
            return username;
        }
    }
}