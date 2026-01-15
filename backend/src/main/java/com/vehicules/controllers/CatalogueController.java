package com.vehicules.controllers;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.services.CatalogueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogue")
@RequiredArgsConstructor
@Tag(name = "Catalogue", description = "API pour la gestion du catalogue de véhicules")
public class CatalogueController {

    private final CatalogueService catalogueService;

    @GetMapping("/une-ligne")
    @Operation(summary = "Obtenir le catalogue avec affichage une ligne par véhicule")
    public ResponseEntity<List<VehiculeDTO>> getCatalogueUneLigne() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
        return ResponseEntity.ok(vehicules);
    }

    @GetMapping("/trois-lignes")
    @Operation(summary = "Obtenir le catalogue avec affichage trois lignes par véhicule")
    public ResponseEntity<List<VehiculeDTO>> getCatalogueTroisLignes() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueTroisLignes();
        return ResponseEntity.ok(vehicules);
    }

    @GetMapping("/soldes")
    @Operation(summary = "Obtenir les véhicules en solde")
    public ResponseEntity<List<VehiculeDTO>> getVehiculesEnSolde() {
        List<VehiculeDTO> vehicules = catalogueService.getVehiculesEnSolde();
        return ResponseEntity.ok(vehicules);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un véhicule par son ID")
    public ResponseEntity<VehiculeDTO> getVehiculeById(@PathVariable Long id) {
        VehiculeDTO vehicule = catalogueService.getVehiculeById(id);
        return ResponseEntity.ok(vehicule);
    }
}
