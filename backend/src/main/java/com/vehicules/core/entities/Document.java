package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // IMMATRICULATION, CESSION, BON_COMMANDE, FACTURE

    @Column(nullable = false)
    private String format; // PDF, HTML

    @Lob
    @Column(nullable = false)
    private byte[] contenu;

    @Column(nullable = false)
    private String nomFichier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @Column(nullable = false)
    private Long taille; // taille en octets
}
