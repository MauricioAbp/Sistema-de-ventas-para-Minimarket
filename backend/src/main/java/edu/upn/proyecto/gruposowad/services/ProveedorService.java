package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Proveedor;
import edu.upn.proyecto.gruposowad.repositories.ProveedorRepository;

@Service
public class ProveedorService {
    @Autowired
    ProveedorRepository proveedorRepository;

    public ArrayList<Proveedor> listar() {
        return (ArrayList<Proveedor>) proveedorRepository.findAll();
    }

    public Proveedor nuevo(Proveedor proveedor) {
        if (proveedor.getActivo() == null) {
            proveedor.setActivo(true);
        }

        return proveedorRepository.save(proveedor);
    }

    public Proveedor actualizar(Long id, Proveedor request) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Proveedor no encontrado"));

        proveedor.setRuc_proveedor(request.getRuc_proveedor());
        proveedor.setRazon_social(request.getRazon_social());
        proveedor.setNombre_comercial(request.getNombre_comercial());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setCorreo(request.getCorreo());
        proveedor.setDireccion(request.getDireccion());

        if (request.getActivo() != null) {
            proveedor.setActivo(request.getActivo());
        }

        return proveedorRepository.save(proveedor);
    }

    public Proveedor desactivar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Proveedor no encontrado"));

        proveedor.setActivo(false);
        return proveedorRepository.save(proveedor);
    }
}
