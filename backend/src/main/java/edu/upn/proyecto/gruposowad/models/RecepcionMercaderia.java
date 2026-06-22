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
@Table(name="recepcion_mercaderia")
public class RecepcionMercaderia {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_recepcion;
    @ManyToOne
    @JoinColumn(name="id_orden_compra")
    private OrdenCompra ordenCompra;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private String numero_recepcion;
    @Column
    private LocalDateTime fecha_recepcion;
    @Column
    private String observaciones;
    @PrePersist
    protected void onCreate(){
        this.fecha_recepcion = LocalDateTime.now();
    }
    public Long getId_recepcion() {
        return id_recepcion;
    }
    public void setId_recepcion(Long id_recepcion) {
        this.id_recepcion = id_recepcion;
    }
    public OrdenCompra getOrdenCompra() {
        return ordenCompra;
    }
    public void setOrdenCompra(OrdenCompra ordenCompra) {
        this.ordenCompra = ordenCompra;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getNumero_recepcion() {
        return numero_recepcion;
    }
    public void setNumero_recepcion(String numero_recepcion) {
        this.numero_recepcion = numero_recepcion;
    }
    public LocalDateTime getFecha_recepcion() {
        return fecha_recepcion;
    }
    public void setFecha_recepcion(LocalDateTime fecha_recepcion) {
        this.fecha_recepcion = fecha_recepcion;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
}
