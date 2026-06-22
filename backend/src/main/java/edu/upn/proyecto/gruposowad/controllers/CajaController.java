package edu.upn.proyecto.gruposowad.controllers;

import org.springframework.web.bind.annotation.RestController;
import edu.upn.proyecto.gruposowad.dtos.caja.CajaResumenResponse;
import edu.upn.proyecto.gruposowad.dtos.caja.AbrirCajaRequest;
import edu.upn.proyecto.gruposowad.dtos.caja.CerrarCajaRequest;
import edu.upn.proyecto.gruposowad.models.Caja;
import edu.upn.proyecto.gruposowad.services.CajaService;
import jakarta.validation.Valid;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/caja")
public class CajaController {
    @Autowired
    CajaService cajaService;
    @GetMapping
    public ArrayList<Caja> listarTodos(){
        return this.cajaService.listar();
    }
    @GetMapping("/{idCaja}/resumen")
public CajaResumenResponse resumen(@PathVariable Long idCaja) {
    return this.cajaService.resumen(idCaja);
}
    @PostMapping
    public Caja registrar(@RequestBody Caja a){
        return this.cajaService.nuevo(a);
    }

    

    @PostMapping("/abrir")
    public Caja abrir(@Valid @RequestBody AbrirCajaRequest request) {
        return this.cajaService.abrir(request);
    }

    @PostMapping("/{idCaja}/cerrar")
    public Caja cerrar(@PathVariable Long idCaja, @Valid @RequestBody CerrarCajaRequest request) {
        return this.cajaService.cerrar(idCaja, request);
    }
    
}
