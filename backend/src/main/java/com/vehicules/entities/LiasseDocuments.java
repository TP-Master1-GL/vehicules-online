package com.vehicules.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


import java.util.ArrayList;
import java.util.List;

@Entity

public class LiasseDocuments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private List<Document> documents = new ArrayList<>();



    public void ajouterDocuments(Document document) {
        documents.add(document);
    }


    public List<Document> getDocuments() {
        return documents;
    }

    public void reinitialiser() {
        documents.clear();
    }

}
