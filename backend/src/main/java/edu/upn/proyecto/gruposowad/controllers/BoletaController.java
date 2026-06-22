package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.dtos.boleta.BoletaResponse;
import edu.upn.proyecto.gruposowad.models.Boleta;
import edu.upn.proyecto.gruposowad.services.BoletaService;

@RequestMapping("/boleta")
@RestController
public class BoletaController {
    @Autowired
    BoletaService boletaService;

    @GetMapping
    public ArrayList<Boleta>listarTodos(){
        return this.boletaService.listar();
    }

    @PostMapping("/registrar")
    public Boleta registrar(@RequestBody Boleta a){
        return this.boletaService.nuevo(a);
    }

    @GetMapping("/{idBoleta}/formal")
    public BoletaResponse obtenerFormal(@PathVariable Long idBoleta) {
        return this.boletaService.obtenerFormal(idBoleta);
    }
}
