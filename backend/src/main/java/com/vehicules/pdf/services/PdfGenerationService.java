// src/main/java/com/vehicules/pdf/services/PdfGenerationService.java
package com.vehicules.pdf.services;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.entities.LigneCommande;
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
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    for (LigneCommande ligne : commande.getLignes()) {
                        Vehicule vehicule = ligne.getVehicule();
                        if (vehicule != null) {
                            return pdfService.genererDemandeImmatriculation(commande, vehicule);
                        }
                    }
                }
                break;
            case CESSION:
                if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
                    for (LigneCommande ligne : commande.getLignes()) {
                        Vehicule vehicule = ligne.getVehicule();
                        if (vehicule != null) {
                            return pdfService.genererCertificatCession(commande, vehicule);
                        }
                    }
                }
                break;
            case BON_COMMANDE:
                return pdfService.genererBonCommande(commande);
            case FACTURE:
                return pdfService.genererFacture(commande);
            case CONTRAT_CREDIT:
                if (commande instanceof com.vehicules.core.entities.CommandeCredit) {
                    return pdfService.genererContratCredit((com.vehicules.core.entities.CommandeCredit) commande);
                }
                break;
        }

        throw new IllegalArgumentException("Type de document non supporté: " + type);
    }
}