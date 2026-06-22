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
@Table(name="detalle_orden_compra")
public class DetalleOrdenCompra {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_detalle_oc;
    @ManyToOne
    @JoinColumn(name="id_orden_compra")
    private OrdenCompra ordenCompra;
    @ManyToOne
    @JoinColumn(name="id_producto")
    private Producto producto;
    @Column
    private Integer cantidad_solicitada;
    @Column
    private BigDecimal precio_unitario_pactado;
    @Column
    private BigDecimal subtotal;
    public Long getId_detalle_oc() {
        return id_detalle_oc;
    }
    public void setId_detalle_oc(Long id_detalle_oc) {
        this.id_detalle_oc = id_detalle_oc;
    }
    public OrdenCompra getOrdenCompra() {
        return ordenCompra;
    }
    public void setOrdenCompra(OrdenCompra ordenCompra) {
        this.ordenCompra = ordenCompra;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public Integer getCantidad_solicitada() {
        return cantidad_solicitada;
    }
    public void setCantidad_solicitada(Integer cantidad_solicitada) {
        this.cantidad_solicitada = cantidad_solicitada;
    }
    public BigDecimal getPrecio_unitario_pactado() {
        return precio_unitario_pactado;
    }
    public void setPrecio_unitario_pactado(BigDecimal precio_unitario_pactado) {
        this.precio_unitario_pactado = precio_unitario_pactado;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
  
}
