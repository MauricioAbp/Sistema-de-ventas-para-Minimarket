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
@Table(name="caja")
public class Caja {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_caja;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private BigDecimal monto_apertura;
    @Column
    private BigDecimal monto_contado;
    @Column
    private BigDecimal diferencia;
    @Column
    private LocalDateTime fecha_apertura;
    @Column
    private LocalDateTime fecha_cierre;
    @Column
    private String observaciones;
    @Column
    private String estado;
    @PrePersist
    protected void onCreate(){
        this.fecha_apertura = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "ABIERTA";
            }
        }
    public Long getId_caja() {
        return id_caja;
    }
    public void setId_caja(Long id_caja) {
        this.id_caja = id_caja;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public BigDecimal getMonto_apertura() {
        return monto_apertura;
    }
    public void setMonto_apertura(BigDecimal monto_apertura) {
        this.monto_apertura = monto_apertura;
    }
    public BigDecimal getMonto_contado() {
        return monto_contado;
    }
    public void setMonto_contado(BigDecimal monto_contado) {
        this.monto_contado = monto_contado;
    }
    public BigDecimal getDiferencia() {
        return diferencia;
    }
    public void setDiferencia(BigDecimal diferencia) {
        this.diferencia = diferencia;
    }
    public LocalDateTime getFecha_apertura() {
        return fecha_apertura;
    }
    public void setFecha_apertura(LocalDateTime fecha_apertura) {
        this.fecha_apertura = fecha_apertura;
    }
    public LocalDateTime getFecha_cierre() {
        return fecha_cierre;
    }
    public void setFecha_cierre(LocalDateTime fecha_cierre) {
        this.fecha_cierre = fecha_cierre;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
        
    }
