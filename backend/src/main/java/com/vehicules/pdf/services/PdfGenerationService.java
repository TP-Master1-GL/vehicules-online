package com.vehicules.pdf.services;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.enums.TypeDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PdfGenerationService {

    @Autowired
    private PdfService pdfService;

    public byte[] generateDocument(Commande commande, TypeDocument type) throws IOException {
        switch (type) {
            case IMMATRICULATION:
                // Pour la demande d'immatriculation, nous avons besoin du véhicule
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    Vehicule vehicule = commande.getLignes().get(0).getVehicule();
                    if (vehicule != null) {
                        return pdfService.genererDemandeImmatriculation(commande, vehicule);
                    }
                }
                break;
            case CESSION:
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    Vehicule vehicule = commande.getLignes().get(0).getVehicule();
                    if (vehicule != null) {
                        return pdfService.genererCertificatCession(commande, vehicule);
                    }
                }
                break;
            case BON_COMMANDE:
                return pdfService.genererBonCommande(commande);
            case FACTURE:
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    Vehicule vehicule = commande.getLignes().get(0).getVehicule();
                    if (vehicule != null) {
                        return pdfService.genererBonCommande(commande);
                    }
                }
                break;
            case CONTRAT_CREDIT:
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    Vehicule vehicule = commande.getLignes().get(0).getVehicule();
                    if (vehicule != null) {
                        return pdfService.genererBonCommande(commande);
                    }
                }
                break;
        }

        throw new IllegalArgumentException("Type de document non supporté: " + type);
    }
}
