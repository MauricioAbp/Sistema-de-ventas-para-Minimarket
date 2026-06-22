package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.models.Empresa;
import edu.upn.proyecto.gruposowad.repositories.EmpresaRepository;

@Service
public class EmpresaService {
    @Autowired
    EmpresaRepository empresaRepository;

    public ArrayList<Empresa> listar() {
        return (ArrayList<Empresa>) empresaRepository.findAll();
    }

    public Empresa nuevo(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public Empresa principal() {
        return empresaRepository.findAll().stream().findFirst().orElseGet(() -> {
            Empresa empresa = new Empresa();
            empresa.setIgv_porcentaje(new java.math.BigDecimal("18.00"));
            return empresaRepository.save(empresa);
        });
    }

    public Empresa guardarPrincipal(Empresa request) {
        Empresa empresa = principal();

        empresa.setRuc(request.getRuc());
        empresa.setRazon_social(request.getRazon_social());
        empresa.setNombre_comercial(request.getNombre_comercial());
        empresa.setDireccion(request.getDireccion());
        empresa.setTelefono(request.getTelefono());
        empresa.setCorreo(request.getCorreo());
        empresa.setIgv_porcentaje(request.getIgv_porcentaje());

        return empresaRepository.save(empresa);
    }
}