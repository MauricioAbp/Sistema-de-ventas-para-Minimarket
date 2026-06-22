package edu.upn.proyecto.gruposowad.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.dtos.boleta.BoletaResponse;
import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Boleta;
import edu.upn.proyecto.gruposowad.models.DetalleVenta;
import edu.upn.proyecto.gruposowad.models.Empresa;
import edu.upn.proyecto.gruposowad.models.Venta;
import edu.upn.proyecto.gruposowad.repositories.BoletaRepository;
import edu.upn.proyecto.gruposowad.repositories.EmpresaRepository;

@Service
public class BoletaService {
    private static final String SERIE_BOLETA = "B001";

    @Autowired
    BoletaRepository boletaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    public ArrayList<Boleta>listar(){
        return (ArrayList<Boleta>)boletaRepository.findAll();
    }

    public Boleta nuevo(Boleta a){
        throw new BusinessException("La boleta se genera desde una venta");
    }

    public synchronized Boleta generarParaVenta(Venta venta) {
        int siguienteNumero = Optional.ofNullable(boletaRepository.maxCorrelativoPorSerie(SERIE_BOLETA))
                .orElse(0) + 1;
        Empresa empresa = empresaRepository.findAll().stream().findFirst().orElse(null);

        Boleta boleta = new Boleta();
        boleta.setVenta(venta);
        boleta.setNumero_boleta(SERIE_BOLETA + "-" + String.format("%08d", siguienteNumero));
        boleta.setFecha_emision(LocalDateTime.now());
        boleta.setRuc_empresa(empresa == null ? null : empresa.getRuc());
        boleta.setRazon_social_empresa(empresa == null ? null : empresa.getRazon_social());
        boleta.setNombre_comercial_empresa(empresa == null ? null : empresa.getNombre_comercial());
        boleta.setDireccion_empresa(empresa == null ? null : empresa.getDireccion());
        boleta.setIgv_porcentaje(empresa == null || empresa.getIgv_porcentaje() == null
                ? new BigDecimal("18.00")
                : empresa.getIgv_porcentaje());
        boleta.setSubtotal(venta.getSubtotal());
        boleta.setIgv_monto(venta.getIgv_monto());
        boleta.setTotal(venta.getTotal());
        return boletaRepository.save(boleta);
    }

    public BoletaResponse obtenerFormal(Long idBoleta) {
        Boleta boleta = boletaRepository.findById(idBoleta)
                .orElseThrow(() -> new BusinessException("Boleta no encontrada"));
        Venta venta = boleta.getVenta();
        Empresa empresa = empresaRepository.findAll().stream().findFirst().orElse(null);
        String[] numeroPartes = separarNumeroBoleta(boleta.getNumero_boleta());

        List<String> detalles = venta == null || venta.getDetalles() == null
                ? Collections.emptyList()
                : venta.getDetalles().stream()
                        .map(this::formatearDetalle)
                        .collect(Collectors.toList());

        return new BoletaResponse(
                valorPrincipal(boleta.getRuc_empresa(), empresa == null ? null : empresa.getRuc()),
                valorPrincipal(boleta.getRazon_social_empresa(), empresa == null ? null : empresa.getRazon_social()),
                valorPrincipal(boleta.getNombre_comercial_empresa(), empresa == null ? null : empresa.getNombre_comercial()),
                valorPrincipal(boleta.getDireccion_empresa(), empresa == null ? null : empresa.getDireccion()),
                numeroPartes[0],
                numeroPartes[1],
                boleta.getFecha_emision(),
                obtenerCajero(venta),
                detalles,
                boleta.getSubtotal(),
                boleta.getIgv_monto(),
                boleta.getTotal(),
                venta == null ? null : venta.getMetodo_pago());
    }

    private String[] separarNumeroBoleta(String numeroBoleta) {
        if (numeroBoleta == null || !numeroBoleta.contains("-")) {
            return new String[] { "", numeroBoleta == null ? "" : numeroBoleta };
        }
        String[] partes = numeroBoleta.split("-", 2);
        return new String[] { partes[0], partes.length > 1 ? partes[1] : "" };
    }

    private String formatearDetalle(DetalleVenta detalle) {
        String producto = detalle.getProducto() == null ? "Producto" : detalle.getProducto().getNombre_producto();
        return detalle.getCantidad() + " x " + producto + " - S/ " + formatearMonto(detalle.getSubtotal());
    }

    private String formatearMonto(BigDecimal monto) {
        return monto == null ? "0.00" : monto.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private String obtenerCajero(Venta venta) {
        if (venta == null || venta.getUsuario() == null) {
            return "";
        }
        String nombre = venta.getUsuario().getNombre() == null ? "" : venta.getUsuario().getNombre();
        String apellido = venta.getUsuario().getApellido() == null ? "" : venta.getUsuario().getApellido();
        return (nombre + " " + apellido).trim();
    }

    private String valorPrincipal(String principal, String respaldo) {
        return principal == null || principal.isBlank() ? respaldo : principal;
    }
}
