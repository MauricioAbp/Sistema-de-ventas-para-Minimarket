package edu.upn.proyecto.gruposowad.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="movimientoinventario")
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_movimiento;
    @ManyToOne
    @JoinColumn(name="id_producto")
    private Producto producto;
    @ManyToOne
@JoinColumn(name = "id_proveedor")
private Proveedor proveedor;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private String tipo_movimiento;
    @Column
    private Integer cantidad;
    @Column
    private Integer stock_anterior;
    @Column
    private Integer stock_posterior;
    @Column
    private String motivo;
    @Column
    private Long id_referencia;
    @Column
    private String tabla_referencia;
    @Column
    private LocalDateTime fecha_movimiento;
    @PrePersist
    protected void onCreate() {
        this.fecha_movimiento = LocalDateTime.now();
    }
    public Long getId_movimiento() {
        return id_movimiento;
    }
    public void setId_movimiento(Long id_movimiento) {
        this.id_movimiento = id_movimiento;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public Proveedor getProveedor() {
    return proveedor;
}

public void setProveedor(Proveedor proveedor) {
    this.proveedor = proveedor;
}
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getTipo_movimiento() {
        return tipo_movimiento;
    }
    public void setTipo_movimiento(String tipo_movimiento) {
        this.tipo_movimiento = tipo_movimiento;
    }
    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public Integer getStock_anterior() {
        return stock_anterior;
    }
    public void setStock_anterior(Integer stock_anterior) {
        this.stock_anterior = stock_anterior;
    }
    public Integer getStock_posterior() {
        return stock_posterior;
    }
    public void setStock_posterior(Integer stock_posterior) {
        this.stock_posterior = stock_posterior;
    }
    public String getMotivo() {
        return motivo;
    }
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    public Long getId_referencia() {
        return id_referencia;
    }
    public void setId_referencia(Long id_referencia) {
        this.id_referencia = id_referencia;
    }
    public String getTabla_referencia() {
        return tabla_referencia;
    }
    public void setTabla_referencia(String tabla_referencia) {
        this.tabla_referencia = tabla_referencia;
    }
    public LocalDateTime getFecha_movimiento() {
        return fecha_movimiento;
    }
    public void setFecha_movimiento(LocalDateTime fecha_movimiento) {
        this.fecha_movimiento = fecha_movimiento;
    }
    
    
}
