package com.vehicules.patterns.bridge;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class VehiculeFormService implements FormService {
    private FormRenderer renderer;

    public VehiculeFormService(@Qualifier("htmlFormRenderer") FormRenderer renderer) {
        this.renderer = renderer;
    }
    
    @Override
    public String renderForm() {
        return renderer.render(
            "VehiculeForm",
            new String[]{"marque", "modele", "prix", "type", "energie"},
            new String[]{"text", "text", "number", "select", "radio"}
        );
    }
    
    @Override
    public void submitForm(String data) {
        System.out.println("Soumission du formulaire véhicule: " + data);
        renderer.processSubmission(data);
    }
    
    @Override
    public String getFormType() {
        return "VEHICULE_FORM";
    }

    public String getRendererInfo() {
        return "Renderer: " + renderer.getClass().getSimpleName() + " - Champs: marque, modele, prix, type, energie";
    }
}