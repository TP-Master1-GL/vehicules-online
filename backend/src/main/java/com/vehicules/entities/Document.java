package com.vehicules.entities;

import javax.persistence.*;

@Entity
@Table(name = "document")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_document", discriminatorType = DiscriminatorType.STRING)
public abstract class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    @Column(name = "type_document", insertable = false, updatable = false)
    private String type;
    
    @Lob
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    private Commande commande;
    
    // Constructeur
    public Document() {}
    
    public Document(Commande commande) {
        this.commande = commande;
    }
    
    // Méthodes abstraites (à implémenter par les sous-classes)
    public abstract void genererContenu();
    
    // Getters et Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }

    public String getContenu() {
        return content;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Commande getCommande() {
        return commande;
    }
    
    public void setCommande(Commande commande) {
        this.commande = commande;
    }
}