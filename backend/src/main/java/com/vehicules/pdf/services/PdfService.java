package com.vehicules.pdf.services;

import com.vehicules.patterns.adapter.DocumentGenerator;
import com.vehicules.core.entities.*;
import com.vehicules.core.enums.TypeDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PdfService {
    
    @Autowired
    private DocumentGenerator documentGenerator;
    
    public byte[] genererDemandeImmatriculation(Commande commande, Vehicule vehicule) throws IOException {
        String title = "DEMANDE D'IMMATRICULATION";
        StringBuilder content = new StringBuilder();
        
        // Informations commande
        content.append("Commande N°: ").append(commande.getId()).append("\n");
        content.append("Date: ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date())).append("\n\n");
        
        // Informations véhicule
        content.append("INFORMATIONS DU VÉHICULE:\n");
        content.append("=======================\n");
        content.append("Marque: ").append(vehicule.getMarque()).append("\n");
        content.append("Modèle: ").append(vehicule.getModele()).append("\n");
        content.append("Type: ").append(vehicule.getType()).append("\n");
        content.append("Énergie: ").append(vehicule.getEnergie()).append("\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("\nINFORMATIONS DU CLIENT:\n");
            content.append("====================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
            }
        }
        
        content.append("\n\nSignature: ___________________");
        
        return documentGenerator.generatePdf(title, content.toString());
    }
    
    public byte[] genererCertificatCession(Commande commande, Vehicule vehicule) throws IOException {
        String title = "CERTIFICAT DE CESSION";
        StringBuilder content = new StringBuilder();
        
        content.append("Je soussigné(e), représentant de Vehicules Online,\n");
        content.append("certifie avoir cédé le véhicule suivant:\n\n");
        
        content.append("DÉSIGNATION DU VÉHICULE:\n");
        content.append("========================\n");
        content.append("Marque: ").append(vehicule.getMarque()).append("\n");
        content.append("Modèle: ").append(vehicule.getModele()).append("\n");
        content.append("Type: ").append(vehicule.getType()).append("\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("\nÀ: ").append(commande.getClient().getNom()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
            }
        }
        
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        content.append("\n\nLe ").append(sdf.format(new Date())).append("\n");
        
        content.append("\n\nCachet et signature du cédant:\n");
        content.append("___________________");
        
        return documentGenerator.generatePdf(title, content.toString());
    }
    
    public byte[] genererBonCommande(Commande commande) throws IOException {
        String title = "BON DE COMMANDE N°" + commande.getId();
        StringBuilder content = new StringBuilder();
        
        // En-tête
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        content.append("Date: ").append(sdf.format(commande.getDateCreation())).append("\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("CLIENT:\n");
            content.append("=======\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
            }
            content.append("\n");
        }
        
        // Détails commande
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("DÉTAILS DE LA COMMANDE:\n");
            content.append("======================\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                content.append("- ").append(ligne.getVehicule().getMarque())
                      .append(" ").append(ligne.getVehicule().getModele())
                      .append(" | Qté: ").append(ligne.getQuantite())
                      .append(" | Prix unitaire: ").append(ligne.getPrixUnitaire()).append(" €\n");
                
                // Options si présentes
                if (ligne.getOptions() != null && !ligne.getOptions().isEmpty()) {
                    for (OptionVehicule option : ligne.getOptions()) {
                        content.append("  + Option: ").append(option.getNom())
                              .append(" (").append(option.getPrix()).append(" €)\n");
                    }
                }
            }
            content.append("\n");
        }
        
        // Total
        content.append("TOTAL: ").append(commande.getMontantTotal() != null ? 
            commande.getMontantTotal() + " €" : "0 €").append("\n\n");
        
        content.append("Signature du client:\n");
        content.append("___________________");
        
        return documentGenerator.generatePdf(title, content.toString());
    }
    
    public byte[] genererFacture(Commande commande) throws IOException {
        String title = "FACTURE N°" + commande.getId();
        StringBuilder content = new StringBuilder();
        
        // En-tête
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        content.append("Date: ").append(sdf.format(commande.getDateCreation())).append("\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("CLIENT:\n");
            content.append("=======\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("TVA Intracommunautaire: [N° TVA]\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
            }
            content.append("\n");
        }
        
        // Détails commande
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("DÉTAILS DE LA FACTURE:\n");
            content.append("=====================\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                content.append("- ").append(ligne.getVehicule().getMarque())
                      .append(" ").append(ligne.getVehicule().getModele())
                      .append(" | Qté: ").append(ligne.getQuantite())
                      .append(" | Prix: ").append(ligne.getPrixUnitaire()).append(" €")
                      .append(" | Total: ").append(ligne.getPrixTotal()).append(" €\n");
            }
            content.append("\n");
        }
        
        // Total
        BigDecimal montantTotal = commande.getMontantTotal() != null ? 
            commande.getMontantTotal() : BigDecimal.ZERO;
        BigDecimal tva = montantTotal.multiply(new BigDecimal("0.20"));
        BigDecimal totalTTC = montantTotal.add(tva);
        
        content.append("SOUS-TOTAL: ").append(montantTotal).append(" €\n");
        content.append("TVA (20%): ").append(tva).append(" €\n");
        content.append("TOTAL TTC: ").append(totalTTC).append(" €\n\n");
        
        content.append("Signature du client:\n");
        content.append("___________________");
        
        return documentGenerator.generatePdf(title, content.toString());
    }
    
    public byte[] genererContratCredit(CommandeCredit commande) throws IOException {
        String title = "CONTRAT DE CRÉDIT N°" + commande.getId();
        StringBuilder content = new StringBuilder();
        
        content.append("Date: ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date())).append("\n\n");
        
        // Informations crédit
        content.append("DÉTAILS DU FINANCEMENT:\n");
        content.append("======================\n");
        
        // CORRECTION : Afficher directement la valeur du taux d'intérêt sans cast
        content.append("Montant financé: ").append(commande.getMontantTotal()).append(" €\n");
        content.append("Durée: ").append(commande.getDureeMois()).append(" mois\n");
        content.append("Taux d'intérêt: ").append(commande.getTauxInteret()).append(" %\n");
        
        // Obtenir la valeur du taux d'intérêt selon son type
        BigDecimal tauxInteret;
        Object tauxInteretObj = commande.getTauxInteret();
        
        if (tauxInteretObj instanceof BigDecimal) {
            tauxInteret = (BigDecimal) tauxInteretObj;
        } else if (tauxInteretObj instanceof Double) {
            tauxInteret = BigDecimal.valueOf((Double) tauxInteretObj);
        } else if (tauxInteretObj instanceof Integer) {
            tauxInteret = BigDecimal.valueOf((Integer) tauxInteretObj);
        } else if (tauxInteretObj instanceof Long) {
            tauxInteret = BigDecimal.valueOf((Long) tauxInteretObj);
        } else if (tauxInteretObj instanceof String) {
            tauxInteret = new BigDecimal((String) tauxInteretObj);
        } else if (tauxInteretObj instanceof Number) {
            tauxInteret = BigDecimal.valueOf(((Number) tauxInteretObj).doubleValue());
        } else {
            tauxInteret = BigDecimal.ZERO;
        }
        
        // Calcul de la mensualité
        BigDecimal montant = commande.getMontantTotal();
        BigDecimal tauxMensuelDecimal = tauxInteret
            .divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP)
            .divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
        int duree = commande.getDureeMois();
        
        // Formule de la mensualité : M = P × [r(1+r)^n] / [(1+r)^n - 1]
        BigDecimal unPlusR = BigDecimal.ONE.add(tauxMensuelDecimal);
        BigDecimal unPlusRpuissanceN = unPlusR.pow(duree);
        BigDecimal numerateur = tauxMensuelDecimal.multiply(unPlusRpuissanceN);
        BigDecimal denominateur = unPlusRpuissanceN.subtract(BigDecimal.ONE);
        BigDecimal mensualite = montant.multiply(numerateur).divide(denominateur, 2, RoundingMode.HALF_UP);
        
        BigDecimal coutTotalCredit = mensualite.multiply(BigDecimal.valueOf(duree)).subtract(montant);
        
        content.append("Mensualité: ").append(mensualite).append(" €\n");
        content.append("Coût total du crédit: ").append(coutTotalCredit).append(" €\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("INFORMATIONS EMPRUNTEUR:\n");
            content.append("======================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("TVA Intracommunautaire: [N° TVA]\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
            }
        }
        
        content.append("\n\nARTICLE 1 - OBJET DU CONTRAT\n");
        content.append("Le présent contrat a pour objet de définir les conditions de crédit.\n\n");
        
        content.append("ARTICLE 2 - ENGAGEMENTS\n");
        content.append("L'emprunteur s'engage à rembourser le crédit selon les échéances prévues.\n\n");
        
        content.append("Signature de l'emprunteur:\n");
        content.append("___________________\n\n");
        
        content.append("Signature du prêteur:\n");
        content.append("___________________");
        
        return documentGenerator.generatePdf(title, content.toString());
    }
    
    // Méthode pour générer du HTML au lieu du PDF (démontre la flexibilité de l'adapter)
    public String genererDocumentHTML(Commande commande, TypeDocument type) throws IOException {
        String title;
        StringBuilder content = new StringBuilder();
        
        switch (type) {
            case IMMATRICULATION:
                title = "Demande d'immatriculation";
                content.append("Commande N°: ").append(commande.getId()).append("<br>");
                content.append("Date: ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date())).append("<br>");
                break;
                
            case CESSION:
                title = "Certificat de cession";
                content.append("Certificat pour la commande N°: ").append(commande.getId()).append("<br>");
                break;
                
            case BON_COMMANDE:
                title = "Bon de commande";
                content.append("Bon de commande N°: ").append(commande.getId()).append("<br>");
                break;
                
            default:
                title = "Document";
                content.append("Document pour la commande N°: ").append(commande.getId()).append("<br>");
        }
        
        return documentGenerator.generateHtml(title, content.toString());
    }
}