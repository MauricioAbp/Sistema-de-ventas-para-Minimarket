package edu.upn.proyecto.gruposowad.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ManyToAny;

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
@Table(name="venta")
public class Venta {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_venta;
    @ManyToOne
    @JoinColumn(name="id_caja")
    private Caja caja;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @Column
    private String numero_venta;
    @Column
    private BigDecimal subtotal;
    @Column
    private LocalDateTime fecha_venta;
    @Column
    private BigDecimal igv_monto;
    @Column
    private BigDecimal total;
    @Column
    private String metodo_pago;
    @Column
    private BigDecimal monto_recibido;
    @Column
    private BigDecimal vuelto;
    @Column
    private String estado;
    @Column
    private LocalDateTime created_at;
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<DetalleVenta> detalles;
    @PrePersist
    protected void onCreate(){
        this.created_at = LocalDateTime.now();
        this.fecha_venta = LocalDateTime.now();
        if (this.estado == null) this.estado = "COMPLETADA";
    }
    public Long getId_venta() {
        return id_venta;
    }
    public void setId_venta(Long id_venta) {
        this.id_venta = id_venta;
    }
    public Caja getCaja() {
        return caja;
    }
    public void setCaja(Caja caja) {
        this.caja = caja;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getNumero_venta() {
        return numero_venta;
    }
    public void setNumero_venta(String numero_venta) {
        this.numero_venta = numero_venta;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    public LocalDateTime getFecha_venta() {
        return fecha_venta;
    }
    public void setFecha_venta(LocalDateTime fecha_venta) {
        this.fecha_venta = fecha_venta;
    }
    public BigDecimal getIgv_monto() {
        return igv_monto;
    }
    public void setIgv_monto(BigDecimal igv_monto) {
        this.igv_monto = igv_monto;
    }
    public BigDecimal getTotal() {
        return total;
    }
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    public String getMetodo_pago() {
        return metodo_pago;
    }
    public void setMetodo_pago(String metodo_pago) {
        this.metodo_pago = metodo_pago;
    }
    public BigDecimal getMonto_recibido() {
        return monto_recibido;
    }
    public void setMonto_recibido(BigDecimal monto_recibido) {
        this.monto_recibido = monto_recibido;
    }
    public BigDecimal getVuelto() {
        return vuelto;
    }
    public void setVuelto(BigDecimal vuelto) {
        this.vuelto = vuelto;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    public List<DetalleVenta> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetalleVenta> detalles) {
        this.detalles = detalles;
    }
    
}
