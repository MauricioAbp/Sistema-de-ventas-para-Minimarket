package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.AnulacionVenta;
import edu.upn.proyecto.gruposowad.repositories.AnulacionVentaRepository;

@Service
public class AnulacionVentaService {
    @Autowired
    AnulacionVentaRepository anulacionventaRepository;

    public ArrayList<AnulacionVenta>listar(){
        return(ArrayList<AnulacionVenta>)anulacionventaRepository.findAll();
    }

    public AnulacionVenta nuevo(AnulacionVenta a){
        return anulacionventaRepository.save(a);
    }
}
