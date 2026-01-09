
// src/main/java/com/vehicules/patterns/adapter/DocumentGenerator.java
package com.vehicules.patterns.adapter;

import com.vehicules.entities.Document;

public interface DocumentGenerator {
    byte[] genererDocument(Document document);
    void sauvegarderDocument(Document document, String chemin);

}