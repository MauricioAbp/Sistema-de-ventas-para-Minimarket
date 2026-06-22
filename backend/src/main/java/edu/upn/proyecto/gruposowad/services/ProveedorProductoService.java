package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.ProveedorProducto;
import edu.upn.proyecto.gruposowad.repositories.ProveedorProductoRepository;

@Service
public class ProveedorProductoService {
   
    @Autowired
    ProveedorProductoRepository proveedorproductoRepository;

    public ArrayList<ProveedorProducto>listar(){
        return (ArrayList<ProveedorProducto>)proveedorproductoRepository.findAll();
    }

    public ProveedorProducto nuevo(ProveedorProducto a){
        return proveedorproductoRepository.save(a);
    }
}
