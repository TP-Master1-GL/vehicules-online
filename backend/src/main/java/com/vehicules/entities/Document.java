package com.vehicules.entities;

import com.vehicules.enumerations.Format;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String type;
    private String content;
    private Format format;

    public Document(String id, String type, String content,  Format format) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.format = format;
    }

    public Document() {}

    private String getType() {
        return type;
    }

    private String getContent() {
        return content;
    }

    private Format getFormat() {return format;}
}
