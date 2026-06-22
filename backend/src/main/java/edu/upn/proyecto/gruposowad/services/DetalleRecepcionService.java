package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.DetalleOrdenCompra;
import edu.upn.proyecto.gruposowad.models.DetalleRecepcion;
import edu.upn.proyecto.gruposowad.repositories.DetalleRecepcionRepository;

@Service
public class DetalleRecepcionService {
    @Autowired
    DetalleRecepcionRepository detallerecepcionRepository;
    public ArrayList<DetalleRecepcion>listar(){
        return (ArrayList<DetalleRecepcion>)detallerecepcionRepository.findAll();
    }

    public DetalleRecepcion nuevo(DetalleRecepcion a){
        return detallerecepcionRepository.save(a);
    }
}
