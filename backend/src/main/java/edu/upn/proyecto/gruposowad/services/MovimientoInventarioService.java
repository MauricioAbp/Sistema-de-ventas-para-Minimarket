package edu.upn.proyecto.gruposowad.services;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.dtos.inventario.AjusteInventarioRequest;
import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.MovimientoInventario;
import edu.upn.proyecto.gruposowad.models.Producto;
import edu.upn.proyecto.gruposowad.models.Proveedor;
import edu.upn.proyecto.gruposowad.models.Usuario;
import edu.upn.proyecto.gruposowad.repositories.MovimientoInventarioRepository;
import edu.upn.proyecto.gruposowad.repositories.ProductoRepository;
import edu.upn.proyecto.gruposowad.repositories.ProveedorRepository;
import edu.upn.proyecto.gruposowad.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
public class MovimientoInventarioService {
    @Autowired
ProveedorRepository proveedorRepository;
    @Autowired
    MovimientoInventarioRepository movimientoInventarioRepository;

    @Autowired
    ProductoRepository productoRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    public ArrayList<MovimientoInventario> listar() {
        return (ArrayList<MovimientoInventario>) movimientoInventarioRepository.findAll();
    }

    public MovimientoInventario nuevo(MovimientoInventario movimiento) {
        return movimientoInventarioRepository.save(movimiento);
    }

    @Transactional
    public MovimientoInventario ajustar(AjusteInventarioRequest request) {
        Producto producto = productoRepository.buscarPorIdConBloqueo(request.getIdProducto())
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        
        
        
        

        String tipo = request.getTipoMovimiento().trim().toUpperCase();
        Proveedor proveedor = null;

if ("ENTRADA".equals(tipo)) {
    if (request.getIdProveedor() == null) {
        throw new BusinessException("El proveedor es obligatorio para entradas de inventario");
    }

    proveedor = proveedorRepository.findById(request.getIdProveedor())
            .orElseThrow(() -> new BusinessException("Proveedor no encontrado"));
}
        Integer stockAnterior = producto.getStock_actual() == null ? 0 : producto.getStock_actual();
        Integer cantidad = request.getCantidad();
        Integer stockNuevo;

        if ("ENTRADA".equals(tipo)) {
            stockNuevo = stockAnterior + cantidad;
        } else if ("AJUSTE".equals(tipo)) {
            stockNuevo = cantidad;
            cantidad = Math.abs(stockNuevo - stockAnterior);
        } else {
            throw new BusinessException("Tipo de movimiento no permitido");
        }

        producto.setStock_actual(stockNuevo);
        productoRepository.save(producto);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setUsuario(usuario);
        movimiento.setTipo_movimiento(tipo);
        movimiento.setProveedor(proveedor);
        movimiento.setCantidad(cantidad);
        movimiento.setStock_anterior(stockAnterior);
        movimiento.setStock_posterior(stockNuevo);
        movimiento.setMotivo(request.getMotivo());
        movimiento.setTabla_referencia("producto");
        movimiento.setId_referencia(producto.getId_producto());
        movimiento.setFecha_movimiento(LocalDateTime.now());

        return movimientoInventarioRepository.save(movimiento);
    }
}