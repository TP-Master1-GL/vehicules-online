package com.vehicules.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Document {
    @Id
    private String id;

    private String orderId;

    @Lob
    private byte[] contenu;

    private String format;

    private String type;

    public Document() {}

    public Document(String id, String orderId, byte[] contenu, String format, String type) {
        this.id = id;
        this.orderId = orderId;
        this.contenu = contenu;
        this.format = format;
        this.type = type;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public byte[] getContenu() { return contenu; }
    public void setContenu(byte[] contenu) { this.contenu = contenu; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}