package edu.upn.proyecto.gruposowad.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.upn.proyecto.gruposowad.models.Empresa;
import edu.upn.proyecto.gruposowad.services.EmpresaService;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {
    @Autowired
    EmpresaService empresaService;

    @GetMapping
    public ArrayList<Empresa> listarTodos() {
        return this.empresaService.listar();
    }

    @PostMapping("/registrar")
    public Empresa registrar(@RequestBody Empresa empresa) {
        return this.empresaService.nuevo(empresa);
    }

    @GetMapping("/principal")
    public Empresa principal() {
        return this.empresaService.principal();
    }

    @PutMapping("/principal")
    public Empresa guardarPrincipal(@RequestBody Empresa empresa) {
        return this.empresaService.guardarPrincipal(empresa);
    }
}