package edu.upn.proyecto.gruposowad.models;

import java.math.BigDecimal;
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
@Table(name="proveedor_producto")
public class ProveedorProducto {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_proveedor_producto;
    @ManyToOne
    @JoinColumn(name="id_proveedor")
    private Proveedor proveedor;
    @ManyToOne
    @JoinColumn(name="id_producto")
    private Producto producto;
    @Column
    private BigDecimal precio_referencia;
    @Column
    private LocalDateTime created_at;
    @PrePersist
    protected void onCreate(){
        this.created_at = LocalDateTime.now();
    }
    public Long getId_proveedor_producto() {
        return id_proveedor_producto;
    }
    public void setId_proveedor_producto(Long id_proveedor_producto) {
        this.id_proveedor_producto = id_proveedor_producto;
    }
    public Proveedor getProveedor() {
        return proveedor;
    }
    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public BigDecimal getPrecio_referencia() {
        return precio_referencia;
    }
    public void setPrecio_referencia(BigDecimal precio_referencia) {
        this.precio_referencia = precio_referencia;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

}
