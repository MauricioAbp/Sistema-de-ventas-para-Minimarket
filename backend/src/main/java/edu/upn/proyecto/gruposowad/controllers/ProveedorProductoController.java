package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.models.ProveedorProducto;
import edu.upn.proyecto.gruposowad.models.Rol;
import edu.upn.proyecto.gruposowad.services.ProveedorProductoService;

@RestController
@RequestMapping("/api/proveedor-producto") // Ruta base recomendada
public class ProveedorProductoController {

    @Autowired
    private ProveedorProductoService proveedorProductoService; // Buenas prácticas: camelCase y private

    @GetMapping
    public ArrayList<ProveedorProducto> listarTodos() {
        // Ahora devuelve una lista de la Entidad, no del Servicio
        return this.proveedorProductoService.listar();
    }

    @PostMapping("/registrar")
    public ProveedorProducto registrar(@RequestBody ProveedorProducto a) {
        return this.proveedorProductoService.nuevo(a);
    }
}