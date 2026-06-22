package edu.upn.proyecto.gruposowad.controllers;

import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.Caja;
import edu.upn.proyecto.gruposowad.models.DetalleOrdenCompra;
import edu.upn.proyecto.gruposowad.services.CajaService;
import edu.upn.proyecto.gruposowad.services.DetalleOrdenCompraService;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/detalle_orden_compra")
public class DetalleOrdenCompraController {
    @Autowired
    DetalleOrdenCompraService detalleordenService;
    @GetMapping
    public ArrayList<DetalleOrdenCompra> listarTodos(){
        return this.detalleordenService.listar();
    }
    @PostMapping
    public DetalleOrdenCompra registrar(@RequestBody DetalleOrdenCompra a){
        return this.detalleordenService.nuevo(a);
    }
    
}
