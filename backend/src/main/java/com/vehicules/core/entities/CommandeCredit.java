package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "commande_credit")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class CommandeCredit extends Commande {
    
    @Column(name = "taux_interet", precision = 5, scale = 2)
    private BigDecimal tauxInteret;
    
    @Column(name = "duree_mois")
    private Integer dureeMois;
    
    @Column(name = "organisme_credit")
    private String organismeCredit;
    
    @Override
    public String getTypePaiement() {
        return "CREDIT";
    }
    
    // Getters et setters basiques (au cas où Lombok ne fonctionne pas)
    public BigDecimal getTauxInteret() { return tauxInteret; }
    public void setTauxInteret(BigDecimal tauxInteret) { this.tauxInteret = tauxInteret; }
    
    public Integer getDureeMois() { return dureeMois; }
    public void setDureeMois(Integer dureeMois) { this.dureeMois = dureeMois; }
    
    public String getOrganismeCredit() { return organismeCredit; }
    public void setOrganismeCredit(String organismeCredit) { this.organismeCredit = organismeCredit; }
    
    // Méthode pour compatibilité avec PdfService
    public BigDecimal getFinancement() {
        return this.getMontantTotal() != null ? this.getMontantTotal() : BigDecimal.ZERO;
    }
}
