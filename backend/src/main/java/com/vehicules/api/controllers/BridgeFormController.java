package com.vehicules.api.controllers;

import com.vehicules.patterns.bridge.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "*")
public class BridgeFormController {
    
    @Autowired
    private VehiculeFormService vehiculeFormService;
    
    @Autowired
    private CommandeFormService commandeFormService;
    
    @GetMapping("/vehicule")
    public ResponseEntity<String> getVehiculeForm() {
        String form = vehiculeFormService.renderForm();
        String info = vehiculeFormService.getRendererInfo();
        return ResponseEntity.ok(form + "\n\n" + info);
    }
    
    @GetMapping("/commande")
    public ResponseEntity<String> getCommandeForm() {
        String form = commandeFormService.renderForm();
        String info = commandeFormService.getRendererInfo();
        return ResponseEntity.ok(form + "\n\n" + info);
    }
    
    @PostMapping("/vehicule/submit")
    public ResponseEntity<String> submitVehiculeForm(@RequestBody String formData) {
        vehiculeFormService.submitForm(formData);
        return ResponseEntity.ok("Formulaire véhicule soumis avec succès");
    }
    
    @PostMapping("/commande/submit")
    public ResponseEntity<String> submitCommandeForm(@RequestBody String formData) {
        commandeFormService.submitForm(formData);
        return ResponseEntity.ok("Formulaire commande soumis avec succès");
    }
    
    @GetMapping("/test-bridge")
    public ResponseEntity<String> testBridgePattern() {
        StringBuilder result = new StringBuilder();
        result.append("=== Test Pattern Bridge ===\n\n");
        
        result.append("1. Formulaire Véhicule (HTML):\n");
        result.append(vehiculeFormService.renderForm());
        result.append("\n\n").append(vehiculeFormService.getRendererInfo());
        
        result.append("\n\n2. Formulaire Commande (Widget):\n");
        result.append(commandeFormService.renderForm());
        result.append("\n\n").append(commandeFormService.getRendererInfo());
        
        return ResponseEntity.ok(result.toString());
    }
}