package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Column(nullable = false)
    private String statut; // EN_COURS, CONFIRMEE, PAYEE, LIVREE, ANNULEE

    @Column(precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Column(nullable = false)
    private String paysLivraison;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LigneCommande> lignes;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents;

    // Getters explicites pour les relations
    public List<LigneCommande> getLignes() {
        return lignes;
    }

    public void setLignes(List<LigneCommande> lignes) {
        this.lignes = lignes;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public abstract String getTypePaiement();

    public BigDecimal calculerMontantTotal() {
        if (lignes == null || lignes.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return lignes.stream()
                .map(LigneCommande::getPrixTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters et setters explicites
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}
