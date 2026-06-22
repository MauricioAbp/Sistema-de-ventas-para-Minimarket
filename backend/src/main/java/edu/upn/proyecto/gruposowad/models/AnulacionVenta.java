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
@Table(name="anulacion_venta")
public class AnulacionVenta {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_anulacion;
    @ManyToOne
    @JoinColumn(name="id_venta")
    private Venta venta;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private String motivo;
    @Column
    private LocalDateTime fecha_anulacion;
    @Column
    private Boolean stock_revertido;
    @PrePersist
    protected void onCreate(){
        this.fecha_anulacion = LocalDateTime.now();
        if (this.stock_revertido == null) {
            this.stock_revertido = false;
        }
    }
     public Long getId_anulacion() {
         return id_anulacion;
     }
     public void setId_anulacion(Long id_anulacion) {
         this.id_anulacion = id_anulacion;
     }
     public Venta getVenta() {
         return venta;
     }
     public void setVenta(Venta venta) {
         this.venta = venta;
     }
     public Usuario getUsuario() {
         return usuario;
     }
     public void setUsuario(Usuario usuario) {
         this.usuario = usuario;
     }
     public String getMotivo() {
         return motivo;
     }
     public void setMotivo(String motivo) {
         this.motivo = motivo;
     }
     public LocalDateTime getFecha_anulacion() {
         return fecha_anulacion;
     }
     public void setFecha_anulacion(LocalDateTime fecha_anulacion) {
         this.fecha_anulacion = fecha_anulacion;
     }
     public Boolean getStock_revertido() {
         return stock_revertido;
     }
     public void setStock_revertido(Boolean stock_revertido) {
         this.stock_revertido = stock_revertido;
     }
    

}
