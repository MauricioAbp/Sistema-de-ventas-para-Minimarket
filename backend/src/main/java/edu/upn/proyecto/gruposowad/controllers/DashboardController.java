package edu.upn.proyecto.gruposowad.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.upn.proyecto.gruposowad.dtos.dashboard.DashboardResponse;
import edu.upn.proyecto.gruposowad.services.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public DashboardResponse resumen() {
        return dashboardService.resumen();
    }
}