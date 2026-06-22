package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.DetalleVenta;
import edu.upn.proyecto.gruposowad.services.DetalleVentaService;

@RestController
@RequestMapping("/detalle-venta")
public class DetalleVentaController {
    @Autowired
    DetalleVentaService detalleVentaService;
    @GetMapping
    public ArrayList<DetalleVenta>listarTodos(){
        return this.detalleVentaService.listar();
    }
    @PostMapping("/registrar")
    public DetalleVenta registrar(@RequestBody DetalleVenta a){
        return this.detalleVentaService.nuevo(a);
    }
}