package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.RecepcionMercaderia;
import edu.upn.proyecto.gruposowad.repositories.RecepcionMercaderiaRepository;

@Service
public class RecepcionMercaderiaService {
    @Autowired
    RecepcionMercaderiaRepository recepcionMercaderiaRepository;

    public ArrayList<RecepcionMercaderia>listar(){
        return (ArrayList<RecepcionMercaderia>)recepcionMercaderiaRepository.findAll();
    }
    public RecepcionMercaderia nuevo(RecepcionMercaderia a){
        return recepcionMercaderiaRepository.save(a);
    }
}
