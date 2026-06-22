package edu.upn.proyecto.gruposowad.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="detalle_recepcion")
public class DetalleRecepcion {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_detalle_recepcion;
    @ManyToOne
    @JoinColumn(name="id_recepcion")
    private RecepcionMercaderia recepcion;
    @ManyToOne
    @JoinColumn(name="id_producto")
    private Producto producto;
    @Column
    private Integer cantidad_recibida;
    @Column
    private BigDecimal precio_compra_unitario;
    @Column
    private BigDecimal subtotal;
    public Long getId_detalle_recepcion() {
        return id_detalle_recepcion;
    }
    public void setId_detalle_recepcion(Long id_detalle_recepcion) {
        this.id_detalle_recepcion = id_detalle_recepcion;
    }
    public RecepcionMercaderia getRecepcion() {
        return recepcion;
    }
    public void setRecepcion(RecepcionMercaderia recepcion) {
        this.recepcion = recepcion;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public Integer getCantidad_recibida() {
        return cantidad_recibida;
    }
    public void setCantidad_recibida(Integer cantidad_recibida) {
        this.cantidad_recibida = cantidad_recibida;
    }
    public BigDecimal getPrecio_compra_unitario() {
        return precio_compra_unitario;
    }
    public void setPrecio_compra_unitario(BigDecimal precio_compra_unitario) {
        this.precio_compra_unitario = precio_compra_unitario;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
   
    
}
