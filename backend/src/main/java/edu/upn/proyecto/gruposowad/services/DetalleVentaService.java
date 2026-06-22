package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.DetalleVenta;
import edu.upn.proyecto.gruposowad.repositories.DetalleVentaRepository;

@Service
public class DetalleVentaService {
    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    public ArrayList<DetalleVenta>listar(){
        return (ArrayList<DetalleVenta>)detalleVentaRepository.findAll();
    }

    public DetalleVenta nuevo(DetalleVenta a){
        return detalleVentaRepository.save(a);
    }
}
