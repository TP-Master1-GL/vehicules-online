package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "client_particulier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientParticulier extends Client {
    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String numeroPermis;

    @Override
    public String getType() {
        return "PARTICULIER";
    }
}
