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
@Table(name="boleta")
public class Boleta {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_boleta;
    @ManyToOne
    @JoinColumn(name="id_venta")
    private Venta venta;
    @Column(unique = true)
    private String numero_boleta;
    @Column
    private LocalDateTime fecha_emision;
    @Column
    private String ruc_empresa;
    @Column
    private String razon_social_empresa;
    @Column
    private String nombre_comercial_empresa;
    @Column
    private String direccion_empresa;
    @Column
    private BigDecimal igv_porcentaje;
    @Column
    private BigDecimal subtotal;
    @Column
    private BigDecimal igv_monto;
    @Column
    private BigDecimal total;
    @Column
    private String url_pdf;
    @PrePersist
    protected void onCreate(){
        this.fecha_emision = LocalDateTime.now();
    }
    public Long getId_boleta() {
        return id_boleta;
    }
    public void setId_boleta(Long id_boleta) {
        this.id_boleta = id_boleta;
    }
    public Venta getVenta() {
        return venta;
    }
    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public String getNumero_boleta() {
        return numero_boleta;
    }
    public void setNumero_boleta(String numero_boleta) {
        this.numero_boleta = numero_boleta;
    }
    public LocalDateTime getFecha_emision() {
        return fecha_emision;
    }
    public void setFecha_emision(LocalDateTime fecha_emision) {
        this.fecha_emision = fecha_emision;
    }
    public String getRuc_empresa() {
        return ruc_empresa;
    }
    public void setRuc_empresa(String ruc_empresa) {
        this.ruc_empresa = ruc_empresa;
    }
    public String getRazon_social_empresa() {
        return razon_social_empresa;
    }
    public void setRazon_social_empresa(String razon_social_empresa) {
        this.razon_social_empresa = razon_social_empresa;
    }
    public String getNombre_comercial_empresa() {
        return nombre_comercial_empresa;
    }
    public void setNombre_comercial_empresa(String nombre_comercial_empresa) {
        this.nombre_comercial_empresa = nombre_comercial_empresa;
    }
    public String getDireccion_empresa() {
        return direccion_empresa;
    }
    public void setDireccion_empresa(String direccion_empresa) {
        this.direccion_empresa = direccion_empresa;
    }
    public BigDecimal getIgv_porcentaje() {
        return igv_porcentaje;
    }
    public void setIgv_porcentaje(BigDecimal igv_porcentaje) {
        this.igv_porcentaje = igv_porcentaje;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
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
    public String getUrl_pdf() {
        return url_pdf;
    }
    public void setUrl_pdf(String url_pdf) {
        this.url_pdf = url_pdf;
    }
    

}
