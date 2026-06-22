package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.Caja;
import edu.upn.proyecto.gruposowad.models.DetalleOrdenCompra;
import edu.upn.proyecto.gruposowad.repositories.CajaRepository;
import edu.upn.proyecto.gruposowad.repositories.DetalleOrdenCompraRepository;

@Service
public class DetalleOrdenCompraService {
    @Autowired
    DetalleOrdenCompraRepository detalleordencompraRepository;

    public ArrayList<DetalleOrdenCompra> listar(){
        return(ArrayList<DetalleOrdenCompra>) detalleordencompraRepository.findAll();
    }
    public DetalleOrdenCompra nuevo(DetalleOrdenCompra a){
        return detalleordencompraRepository.save(a);
    }
}