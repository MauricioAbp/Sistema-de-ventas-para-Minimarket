package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.Rol;
import edu.upn.proyecto.gruposowad.repositories.RolRepository;

@Service

public class RolService {
    @Autowired
    RolRepository rolRepository;

    public ArrayList<Rol> listar(){
        return (ArrayList<Rol>) rolRepository.findAll();
    }
    public Rol nuevo(Rol a){
        return rolRepository.save(a);
    }
}
