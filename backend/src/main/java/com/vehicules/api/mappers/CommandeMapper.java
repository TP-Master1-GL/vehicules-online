// src/main/java/com/vehicules/api/mappers/CommandeMapper.java
package com.vehicules.api.mappers;

import com.vehicules.api.dto.CommandeDTO;
import com.vehicules.api.dto.LigneCommandeDTO;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.LigneCommande;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CommandeMapper {

    private final ClientMapper clientMapper;
    private final VehiculeMapper vehiculeMapper;

    public CommandeMapper(ClientMapper clientMapper, VehiculeMapper vehiculeMapper) {
        this.clientMapper = clientMapper;
        this.vehiculeMapper = vehiculeMapper;
    }

    public CommandeDTO toDTO(Commande commande) {
        if (commande == null) {
            return null;
        }

        CommandeDTO dto = new CommandeDTO();
        dto.setId(commande.getId());
        dto.setDateCreation(commande.getDateCreation());
        dto.setStatut(commande.getStatut());
        dto.setMontantTotal(commande.getMontantTotal());
        
        // Utiliser getTypePaiement() qui est abstrait dans Commande
        if (commande instanceof com.vehicules.core.entities.CommandeComptant) {
            dto.setTypePaiement("COMPTANT");
        } else if (commande instanceof com.vehicules.core.entities.CommandeCredit) {
            dto.setTypePaiement("CREDIT");
        } else {
            dto.setTypePaiement("INCONNU");
        }
        
        if (commande.getClient() != null) {
            dto.setClient(clientMapper.toDTO(commande.getClient()));
        }
        
        if (commande.getLignes() != null) {
            dto.setLignes(commande.getLignes().stream()
                    .map(this::toLigneDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private LigneCommandeDTO toLigneDTO(LigneCommande ligne) {
        if (ligne == null) {
            return null;
        }

        LigneCommandeDTO dto = new LigneCommandeDTO();
        dto.setId(ligne.getId());
        dto.setQuantite(ligne.getQuantite());
        dto.setPrixUnitaire(ligne.getPrixUnitaire());
        dto.setPrixTotal(ligne.getPrixTotal());
        
        if (ligne.getVehicule() != null) {
            dto.setVehicule(vehiculeMapper.toDTO(ligne.getVehicule()));
        }

        return dto;
    }
}