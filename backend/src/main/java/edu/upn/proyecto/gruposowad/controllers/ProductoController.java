package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.upn.proyecto.gruposowad.models.Producto;
import edu.upn.proyecto.gruposowad.services.ProductoService;

@RestController
@RequestMapping("/producto")
public class ProductoController {
    @Autowired
    ProductoService productoService;

    @GetMapping
    public ArrayList<Producto> listarTodos() {
        return this.productoService.listar();
    }

    @PostMapping("/registrar")
    public Producto registrar(@RequestBody Producto producto) {
        return this.productoService.nuevo(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        return this.productoService.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    public Producto desactivar(@PathVariable Long id) {
        return this.productoService.desactivar(id);
    }
}