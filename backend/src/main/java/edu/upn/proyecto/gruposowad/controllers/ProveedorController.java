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
import edu.upn.proyecto.gruposowad.models.Proveedor;
import edu.upn.proyecto.gruposowad.services.ProveedorService;

@RestController
@RequestMapping("/proveedor")
public class ProveedorController {
    @Autowired
    ProveedorService proveedorService;

    @GetMapping
    public ArrayList<Proveedor> listarTodos() {
        return this.proveedorService.listar();
    }

    @PostMapping("/registrar")
    public Proveedor registrar(@RequestBody Proveedor proveedor) {
        return this.proveedorService.nuevo(proveedor);
    }

    @PutMapping("/{id}")
    public Proveedor actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        return this.proveedorService.actualizar(id, proveedor);
    }

    @DeleteMapping("/{id}")
    public Proveedor desactivar(@PathVariable Long id) {
        return this.proveedorService.desactivar(id);
    }
}