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
import edu.upn.proyecto.gruposowad.models.Categoria;
import edu.upn.proyecto.gruposowad.services.CategoriaService;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {
    @Autowired
    CategoriaService categoriaService;

    @GetMapping("/listar")
    public ArrayList<Categoria> listarTodos() {
        return this.categoriaService.listar();
    }

    @PostMapping
    public Categoria registrar(@RequestBody Categoria categoria) {
        return this.categoriaService.nuevo(categoria);
    }

    @PutMapping("/{id}")
    public Categoria actualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return this.categoriaService.actualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public Categoria desactivar(@PathVariable Long id) {
        return this.categoriaService.desactivar(id);
    }
}