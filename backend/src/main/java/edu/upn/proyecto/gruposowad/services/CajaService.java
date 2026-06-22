package edu.upn.proyecto.gruposowad.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.upn.proyecto.gruposowad.dtos.caja.AbrirCajaRequest;
import edu.upn.proyecto.gruposowad.dtos.caja.CajaResumenResponse;
import edu.upn.proyecto.gruposowad.dtos.caja.CerrarCajaRequest;
import edu.upn.proyecto.gruposowad.exceptions.BusinessException;
import edu.upn.proyecto.gruposowad.models.Caja;
import edu.upn.proyecto.gruposowad.models.Usuario;
import edu.upn.proyecto.gruposowad.repositories.CajaRepository;
import edu.upn.proyecto.gruposowad.repositories.UsuarioRepository;
import edu.upn.proyecto.gruposowad.repositories.VentaRepository;

@Service
public class CajaService {
    @Autowired
    CajaRepository cajaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    VentaRepository ventaRepository;

    public ArrayList<Caja> listar() {
        return (ArrayList<Caja>) cajaRepository.findAll();
    }

    public Caja nuevo(Caja caja) {
        return cajaRepository.save(caja);
    }

    public Caja abrir(AbrirCajaRequest request) {
        usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        cajaRepository.buscarCajaAbiertaGlobal("ABIERTA").ifPresent(caja -> {
            throw new BusinessException("Ya existe una caja abierta");
        });

        Usuario usuario = new Usuario();
        usuario.setId_usuario(request.getIdUsuario());

        Caja caja = new Caja();
        caja.setUsuario(usuario);
        caja.setMonto_apertura(request.getMontoApertura());
        caja.setFecha_apertura(LocalDateTime.now());
        caja.setEstado("ABIERTA");

        return cajaRepository.save(caja);
    }

    public Caja cerrar(Long idCaja, CerrarCajaRequest request) {
        Caja caja = cajaRepository.findById(idCaja)
                .orElseThrow(() -> new BusinessException("Caja no encontrada"));

        if (!"ABIERTA".equalsIgnoreCase(caja.getEstado())) {
            throw new BusinessException("La caja no esta abierta");
        }

        CajaResumenResponse resumen = resumen(idCaja);
        BigDecimal montoEsperado = resumen.getMontoEsperado();

        caja.setMonto_contado(request.getMontoContado());
        caja.setFecha_cierre(LocalDateTime.now());
        caja.setObservaciones(request.getObservaciones());
        caja.setDiferencia(request.getMontoContado().subtract(montoEsperado));
        caja.setEstado("CERRADA");

        return cajaRepository.save(caja);
    }

    public CajaResumenResponse resumen(Long idCaja) {
        Caja caja = cajaRepository.findById(idCaja)
                .orElseThrow(() -> new BusinessException("Caja no encontrada"));

        BigDecimal montoApertura = caja.getMonto_apertura() == null
                ? BigDecimal.ZERO
                : caja.getMonto_apertura();

        BigDecimal totalVendido = nullToZero(ventaRepository.totalVendidoPorCaja(idCaja));
        BigDecimal totalEfectivo = nullToZero(ventaRepository.totalEfectivoPorCaja(idCaja));
        BigDecimal montoEsperado = montoApertura.add(totalEfectivo);

        Map<String, BigDecimal> ventasPorMetodo = new LinkedHashMap<>();

        for (Object[] row : ventaRepository.ventasPorMetodoCaja(idCaja)) {
            String metodo = row[0] == null ? "NO_ESPECIFICADO" : String.valueOf(row[0]);
            BigDecimal total = toBigDecimal(row[1]);
            ventasPorMetodo.put(metodo, total);
        }

        return new CajaResumenResponse(
                caja.getId_caja(),
                caja.getEstado(),
                montoApertura,
                totalVendido,
                totalEfectivo,
                montoEsperado,
                ventasPorMetodo);
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal bd) {
            return bd;
        }

        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }

        return new BigDecimal(String.valueOf(value));
    }
}