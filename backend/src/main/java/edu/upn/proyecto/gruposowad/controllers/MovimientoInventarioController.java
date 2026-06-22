package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.upn.proyecto.gruposowad.dtos.inventario.AjusteInventarioRequest;
import edu.upn.proyecto.gruposowad.models.MovimientoInventario;
import edu.upn.proyecto.gruposowad.services.MovimientoInventarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/movimientoinventario")
public class MovimientoInventarioController {
    @Autowired
    MovimientoInventarioService movimientoInventarioService;

    @GetMapping
    public ArrayList<MovimientoInventario> listarTodos() {
        return this.movimientoInventarioService.listar();
    }

    @PostMapping("/registrar")
    public MovimientoInventario registrar(@RequestBody MovimientoInventario movimiento) {
        return this.movimientoInventarioService.nuevo(movimiento);
    }

    @PostMapping("/ajustar")
    public MovimientoInventario ajustar(@Valid @RequestBody AjusteInventarioRequest request) {
        return this.movimientoInventarioService.ajustar(request);
    }
}