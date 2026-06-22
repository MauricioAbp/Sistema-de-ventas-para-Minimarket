package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.RecepcionMercaderia;
import edu.upn.proyecto.gruposowad.services.RecepcionMercaderiaService;

@RestController
@RequestMapping("/recepcion_mercaderia")
public class RecepcionMercaderiaController {
    @Autowired
    RecepcionMercaderiaService recepcionMercaderiaService;

    @GetMapping
    public ArrayList<RecepcionMercaderia>listarTodos(){
        return this.recepcionMercaderiaService.listar();
    }
    @PostMapping("/registrar")
    public RecepcionMercaderia registrar(@RequestBody RecepcionMercaderia a){
        return this.recepcionMercaderiaService.nuevo(a);
    }
}
