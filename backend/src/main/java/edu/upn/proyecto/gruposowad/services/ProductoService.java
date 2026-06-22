package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Producto;
import edu.upn.proyecto.gruposowad.repositories.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    ProductoRepository productoRepository;

    public ArrayList<Producto> listar() {
        return (ArrayList<Producto>) productoRepository.findAll();
    }

    public Producto nuevo(Producto producto) {
        if (producto.getActivo() == null) {
            producto.setActivo(true);
        }

        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));

        producto.setCategoria(request.getCategoria());
        producto.setCodigo_producto(request.getCodigo_producto());
        producto.setNombre_producto(request.getNombre_producto());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio_compra(request.getPrecio_compra());
        producto.setPrecio_venta(request.getPrecio_venta());
        producto.setStock_actual(request.getStock_actual());
        producto.setStock_minimo(request.getStock_minimo());

        if (request.getActivo() != null) {
            producto.setActivo(request.getActivo());
        }

        return productoRepository.save(producto);
    }

    public Producto desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));

        producto.setActivo(false);
        return productoRepository.save(producto);
    }
}