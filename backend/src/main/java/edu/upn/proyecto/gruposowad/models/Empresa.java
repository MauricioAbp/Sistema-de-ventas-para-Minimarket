package edu.upn.proyecto.gruposowad.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="empresa")

public class Empresa {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_empresa;
    @Column
    private String ruc;
    @Column
    private String razon_social;
    @Column
    private String nombre_comercial;
    @Column
    private String direccion;
    @Column
    private String telefono;
    @Column
    private String correo;
    @Column
    private BigDecimal igv_porcentaje;
    public Long getId_empresa() {
        return id_empresa;
    }
    public void setId_empresa(Long id_empresa) {
        this.id_empresa = id_empresa;
    }
    public String getRuc() {
        return ruc;
    }
    public void setRuc(String ruc) {
        this.ruc = ruc;
    }
    public String getRazon_social() {
        return razon_social;
    }
    public void setRazon_social(String razon_social) {
        this.razon_social = razon_social;
    }
    public String getNombre_comercial() {
        return nombre_comercial;
    }
    public void setNombre_comercial(String nombre_comercial) {
        this.nombre_comercial = nombre_comercial;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public BigDecimal getIgv_porcentaje() {
        return igv_porcentaje;
    }
    public void setIgv_porcentaje(BigDecimal igv_porcentaje) {
        this.igv_porcentaje = igv_porcentaje;
    }
    
}
