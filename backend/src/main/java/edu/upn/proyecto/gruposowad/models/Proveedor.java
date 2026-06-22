package edu.upn.proyecto.gruposowad.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="proveedor")
public class Proveedor {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_proveedor;
    @Column
    private String ruc_proveedor;
    @Column
    private String razon_social;
    @Column
    private String nombre_comercial;
    @Column
    private String telefono;
    @Column
    private String correo;
    @Column
    private String direccion;
    @Column
    private Boolean activo;
    @Column
    private LocalDateTime created_at;
    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        if (this.activo == null) {
            this.activo = true;
        }
    }
    public Long getId_proveedor() {
        return id_proveedor;
    }
    public void setId_proveedor(Long id_proveedor) {
        this.id_proveedor = id_proveedor;
    }
    public String getRuc_proveedor() {
        return ruc_proveedor;
    }
    public void setRuc_proveedor(String ruc_proveedor) {
        this.ruc_proveedor = ruc_proveedor;
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
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public Boolean getActivo() {
        return activo;
    }
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    
}
