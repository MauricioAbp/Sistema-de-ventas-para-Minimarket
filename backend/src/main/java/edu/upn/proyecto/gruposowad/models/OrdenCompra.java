package edu.upn.proyecto.gruposowad.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="ordencompra")
public class OrdenCompra {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_orden_compra;
    @ManyToOne
    @JoinColumn(name="id_proveedor")
    private Proveedor proveedor;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private String numero_orden;
    @Column
    private LocalDateTime fecha_emision;
    @Column
    private LocalDateTime fecha_esperada;
    @Column
    private String estado;
    @Column
    private String observaciones;
    @Column
    private BigDecimal total_estimado;
    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL)
    private List<DetalleOrdenCompra> detalles;
    
    public List<DetalleOrdenCompra> getdetalles(){
        return detalles;
    }
    public void setDetalles(List<DetalleOrdenCompra>detalles){
        this.detalles = detalles;
    }
    @PrePersist
    protected void onCreate() {
        this.fecha_emision = LocalDateTime.now();
        if(this.estado ==  null) this.estado = "PENDIENTE";
    }
    public Long getId_orden_compra() {
        return id_orden_compra;
    }
    public void setId_orden_compra(Long id_orden_compra) {
        this.id_orden_compra = id_orden_compra;
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
    public String getNumero_orden() {
        return numero_orden;
    }
    public void setNumero_orden(String numero_orden) {
        this.numero_orden = numero_orden;
    }
    public LocalDateTime getFecha_emision() {
        return fecha_emision;
    }
    public void setFecha_emision(LocalDateTime fecha_emision) {
        this.fecha_emision = fecha_emision;
    }
    public LocalDateTime getFecha_esperada() {
        return fecha_esperada;
    }
    public void setFecha_esperada(LocalDateTime fecha_esperada) {
        this.fecha_esperada = fecha_esperada;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public BigDecimal getTotal_estimado() {
        return total_estimado;
    }
    public void setTotal_estimado(BigDecimal total_estimado) {
        this.total_estimado = total_estimado;
    }
    
}
