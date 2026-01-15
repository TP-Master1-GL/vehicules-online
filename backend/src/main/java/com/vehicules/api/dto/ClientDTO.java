package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String type;

    // Pour ClientParticulier
    private String prenom;
    private String numeroPermis;

    // Pour Societe
    private String raisonSociale;
    private String siret;
}
