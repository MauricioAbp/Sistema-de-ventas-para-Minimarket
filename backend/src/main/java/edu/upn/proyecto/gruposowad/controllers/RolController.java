package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.Rol;
import edu.upn.proyecto.gruposowad.services.RolService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/rol")
public class RolController {
    @Autowired
    RolService rolService;
    @GetMapping
    public ArrayList<Rol> listarTodos(){
        return this.rolService.listar();
    }
    @PostMapping("/registrar")
    public Rol registrar(@RequestBody Rol a) {
        return this.rolService.nuevo(a);
    }
    
}
    

