package com.vehicules.patterns.singleton;

import com.vehicules.entities.LiasseDocuments;
import com.vehicules.enumerations.Format;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class LiasseViergeSingleton {

    private static LiasseViergeSingleton instance;

    private Format format;

    private List<DocumentVierge> documentsVierges;

    private LiasseViergeSingleton(Format format) {
        this.format = format;
        rechargerDocumentsVierges();
    }

    public static synchronized LiasseViergeSingleton getInstance(Format format) {
        if (instance == null || instance.format != format) {
            instance = new LiasseViergeSingleton(format);
        }
        return instance;
    }

    public List<DocumentVierge> getDocumentsVierges() {
        return documentsVierges;
    }

    public DocumentVierge getDocumentVierge(String type) {
        for (DocumentVierge doc : documentsVierges) {
            if (doc.getType().equalsIgnoreCase(type)) {
                return doc;
            }
        }
        return null;
    }

    public LiasseDocuments construireLiasseVierge(){

        LiasseDocuments liasse = new LiasseDocuments();
        for (DocumentVierge doc : documentsVierges) {
            liasse.ajouterDocuments(doc.remplirTemplate(new HashMap<>()));
        }
        return liasse;
    }


    public void rechargerDocumentsVierges() {

        documentsVierges = new ArrayList<>();

        String extension = format == Format.PDF ? "[PDF]" : "[HTML]";

        documentsVierges.add(
                new DocumentVierge("BON DE COMMANDE",
                extension + "Bon de commande",
                        format)
        );

        documentsVierges.add(
                new DocumentVierge("DEMANDE D'IMMATRICULATION",
                        extension + "Demande d'immatriculation",
                        format)
        );

        documentsVierges.add(
                new DocumentVierge("CERTIFICAT DE SESSION",
                        extension + "Certification de session",
                        format)
        );
    }

}

