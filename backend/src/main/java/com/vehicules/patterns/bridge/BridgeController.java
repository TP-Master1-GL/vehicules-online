package com.vehicules.patterns.bridge;

import com.vehicules.patterns.bridge.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "*")
public class BridgeController {
    
    @Autowired
    @Qualifier("htmlFormRenderer")
    private FormRenderer htmlRenderer;
    
    @Autowired
    @Qualifier("widgetFormRenderer")
    private FormRenderer widgetRenderer;
    
    @GetMapping("/vehicule/html")
    public ResponseEntity<String> getVehiculeFormHtml() {
        FormService service = new VehiculeFormService(htmlRenderer);
        return ResponseEntity.ok(service.renderForm());
    }
    
    @GetMapping("/vehicule/widget")
    public ResponseEntity<String> getVehiculeFormWidget() {
        FormService service = new VehiculeFormService(widgetRenderer);
        return ResponseEntity.ok(service.renderForm());
    }
    
    @GetMapping("/commande/html")
    public ResponseEntity<String> getCommandeFormHtml() {
        FormService service = new CommandeFormService(htmlRenderer);
        return ResponseEntity.ok(service.renderForm());
    }
    
    @GetMapping("/commande/widget")
    public ResponseEntity<String> getCommandeFormWidget() {
        FormService service = new CommandeFormService(widgetRenderer);
        return ResponseEntity.ok(service.renderForm());
    }
    
    @PostMapping("/submit/html")
    public ResponseEntity<String> submitHtmlForm(@RequestBody String formData) {
        htmlRenderer.processSubmission(formData);
        return ResponseEntity.ok("Formulaire HTML soumis avec succès");
    }
    
    @PostMapping("/submit/widget")
    public ResponseEntity<String> submitWidgetForm(@RequestBody String formData) {
        widgetRenderer.processSubmission(formData);
        return ResponseEntity.ok("Formulaire Widget soumis avec succès");
    }
}