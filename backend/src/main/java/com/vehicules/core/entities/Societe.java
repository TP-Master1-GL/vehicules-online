package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "societe")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class Societe extends Client {
    @Column(nullable = false, unique = true)
    private String siret;

    @Column(nullable = false)
    private String raisonSociale;

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Filiale> filiales;

    @Override
    public String getType() {
        return "SOCIETE";
    }
}
