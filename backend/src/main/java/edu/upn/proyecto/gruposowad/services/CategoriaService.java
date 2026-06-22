package edu.upn.proyecto.gruposowad.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Categoria;
import edu.upn.proyecto.gruposowad.repositories.CategoriaRepository;

@Service
public class CategoriaService {
    @Autowired
    CategoriaRepository categoriaRepository;

    public ArrayList<Categoria> listar() {
        return (ArrayList<Categoria>) categoriaRepository.findAll();
    }

    public Categoria nuevo(Categoria categoria) {
        if (categoria.getActivo() == null) {
            categoria.setActivo(true);
        }

        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Categoría no encontrada"));

        categoria.setNombre_categoria(request.getNombre_categoria());
        categoria.setDescripcion(request.getDescripcion());

        if (request.getActivo() != null) {
            categoria.setActivo(request.getActivo());
        }

        return categoriaRepository.save(categoria);
    }

    public Categoria desactivar(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Categoría no encontrada"));

        categoria.setActivo(false);
        return categoriaRepository.save(categoria);
    }
}