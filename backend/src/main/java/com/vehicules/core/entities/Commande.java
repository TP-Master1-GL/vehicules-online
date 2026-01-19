package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "commande")
@Data
@NoArgsConstructor
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

    public abstract String getTypePaiement();

    public BigDecimal calculerMontantTotal() {
        if (lignes == null || lignes.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return lignes.stream()
                .map(LigneCommande::getPrixTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @PrePersist
    public void prePersist() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (statut == null) {
            statut = "EN_COURS";
        }
        if (paysLivraison == null) {
            paysLivraison = "FR";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.montantTotal = calculerMontantTotal();
    }

    // Ajouter dans la classe Commande
// GETTERS
public Long getId() { return id; }
public LocalDateTime getDateCreation() { return dateCreation; }
public String getStatut() { return statut; }
public BigDecimal getMontantTotal() { return montantTotal; }
public Client getClient() { return client; }
public List<LigneCommande> getLignes() { return lignes; }
public String getPaysLivraison() { return paysLivraison; }

// SETTERS
public void setId(Long id) { this.id = id; }
public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
public void setStatut(String statut) { this.statut = statut; }
public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }
public void setClient(Client client) { this.client = client; }
public void setLignes(List<LigneCommande> lignes) { this.lignes = lignes; }
public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }

}