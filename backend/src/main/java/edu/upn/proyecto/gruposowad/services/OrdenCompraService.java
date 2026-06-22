package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.OrdenCompra;
import edu.upn.proyecto.gruposowad.repositories.OrdenCompraRepository;

@Service

public class OrdenCompraService {
    @Autowired
    OrdenCompraRepository ordenCompraRepository;
    
    public ArrayList<OrdenCompra>listar(){
        return (ArrayList<OrdenCompra>)ordenCompraRepository.findAll();
    }

    public OrdenCompra nuevo(OrdenCompra a){
        return ordenCompraRepository.save(a);
    }
}
