package edu.upn.proyecto.gruposowad.controllers;
import edu.upn.proyecto.gruposowad.dtos.venta.VentaConsultaResponse;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.PathVariable;
import edu.upn.proyecto.gruposowad.dtos.venta.AnularVentaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import edu.upn.proyecto.gruposowad.dtos.venta.VentaRequest;
import edu.upn.proyecto.gruposowad.dtos.venta.VentaResponse;
import edu.upn.proyecto.gruposowad.models.Venta;
import edu.upn.proyecto.gruposowad.services.VentaService;
import jakarta.validation.Valid;
import java.util.List;
import edu.upn.proyecto.gruposowad.dtos.venta.VentaHistorialResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/venta")
public class VentaController {
    @Autowired
    VentaService ventaService;
    @GetMapping("/{idVenta}")
public VentaConsultaResponse buscarPorId(@PathVariable Long idVenta) {
    return new VentaConsultaResponse(this.ventaService.buscarPorId(idVenta));
}

    @GetMapping
public List<VentaHistorialResponse> listarTodos() {
    return this.ventaService.listar().stream()
            .map(VentaHistorialResponse::new)
            .toList();
}
     @PostMapping
     public Venta registrar(@RequestBody Venta a){
        return this.ventaService.nuevo(a);
     } 

     @PostMapping("/{idVenta}/anular")
public VentaConsultaResponse anular(@PathVariable Long idVenta, @Valid @RequestBody AnularVentaRequest request) {
    return new VentaConsultaResponse(this.ventaService.anular(idVenta, request));
}

     @PostMapping("/pos")
     public VentaResponse registrarPos(@Valid @RequestBody VentaRequest request){
        return this.ventaService.registrarPos(request);
     }
}
