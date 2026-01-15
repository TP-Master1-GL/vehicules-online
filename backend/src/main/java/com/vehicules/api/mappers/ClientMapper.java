package com.vehicules.api.mappers;

import com.vehicules.api.dto.ClientDTO;
import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.entities.Societe;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientDTO toDTO(Client client) {
        if (client == null) {
            return null;
        }

        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setEmail(client.getEmail());
        dto.setTelephone(client.getTelephone());
        dto.setAdresse(client.getAdresse());
        dto.setType(client.getType());

        // Informations spécifiques selon le type de client
        if (client instanceof ClientParticulier) {
            ClientParticulier particulier = (ClientParticulier) client;
            dto.setPrenom(particulier.getPrenom());
            dto.setNumeroPermis(particulier.getNumeroPermis());
        } else if (client instanceof Societe) {
            Societe societe = (Societe) client;
            dto.setRaisonSociale(societe.getRaisonSociale());
            dto.setSiret(societe.getSiret());
        }

        return dto;
    }
}

