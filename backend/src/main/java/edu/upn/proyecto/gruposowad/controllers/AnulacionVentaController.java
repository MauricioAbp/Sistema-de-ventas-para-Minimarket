package edu.upn.proyecto.gruposowad.controllers;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.AnulacionVenta;
import edu.upn.proyecto.gruposowad.services.AnulacionVentaService;

@RestController
@RequestMapping("/anulacion_venta")
public class AnulacionVentaController {
    @Autowired
    AnulacionVentaService anulacionventaService;

    @GetMapping
    public ArrayList<AnulacionVenta>listarTodos(){
        return this.anulacionventaService.listar();
    }

    @PostMapping("/registrar")
    public AnulacionVenta registrar(@RequestBody AnulacionVenta a){
        return this.anulacionventaService.nuevo(a);

    }
}
