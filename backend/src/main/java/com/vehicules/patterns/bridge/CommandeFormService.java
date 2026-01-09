package com.vehicules.patterns.bridge;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class CommandeFormService implements FormService {
    private FormRenderer renderer;

    public CommandeFormService(@Qualifier("widgetFormRenderer") FormRenderer renderer) {
        this.renderer = renderer;
    }
    
    @Override
    public String renderForm() {
        return renderer.render(
            "CommandeForm",
            new String[]{"clientId", "vehiculeId", "options", "paiementType"},
            new String[]{"text", "text", "checkbox", "select"}
        );
    }
    
    @Override
    public void submitForm(String data) {
        System.out.println("Soumission du formulaire commande: " + data);
        renderer.processSubmission(data);
    }
    
    @Override
    public String getFormType() {
        return "COMMANDE_FORM";
    }

    public String getRendererInfo() {
        return "Renderer: " + renderer.getClass().getSimpleName() + " - Champs: clientId, vehiculeId, options, paiementType";
    }
}