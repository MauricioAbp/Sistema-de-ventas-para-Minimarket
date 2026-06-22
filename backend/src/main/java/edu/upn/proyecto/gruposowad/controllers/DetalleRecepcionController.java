package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.DetalleRecepcion;
import edu.upn.proyecto.gruposowad.services.DetalleRecepcionService;

@RestController
@RequestMapping("/detalle_recepcion")
public class DetalleRecepcionController {

    @Autowired
    DetalleRecepcionService detallerecepcionService;

    @GetMapping
    public ArrayList<DetalleRecepcion>listarTodos(){
        return this.detallerecepcionService.listar();
    }
    
    @PostMapping("/registrar")
    public DetalleRecepcion registrar(@RequestBody DetalleRecepcion a){
        return this.detallerecepcionService.nuevo(a);
    }
}
