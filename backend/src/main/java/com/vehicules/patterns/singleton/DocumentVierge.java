package com.vehicules.patterns.singleton;


import com.vehicules.entities.Document;
import com.vehicules.enumerations.Format;


import java.util.Map;
import java.util.UUID;


public class DocumentVierge {

    private String type;

    private String template;

    private Format format;

    public DocumentVierge(String type, String template,  Format format) {
        this.type = type;
        this.template = template;
        this.format = format;
    }

    public String getType() {
        return type;
    }

    public String getTemplate() {
        return template;
    }

    public Format getFormat() {
        return format;
    }

    public Document remplirTemplate(Map<String, String> donnees){

        String contenuFinal = template;

        for (Map.Entry<String, String> donnee : donnees.entrySet()) {

            contenuFinal = contenuFinal.replace(
                    "{{" + donnee.getKey() + "}}", donnee.getValue()
            );
        }

        return new Document(
                UUID.randomUUID().toString(),
                type,
                contenuFinal,
                format);
    }

}
