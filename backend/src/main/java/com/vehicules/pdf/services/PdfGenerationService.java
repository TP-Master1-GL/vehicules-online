package com.vehicules.pdf.services;

import com.vehicules.core.entities.*;
import com.vehicules.core.enums.TypeDocument;
import com.vehicules.patterns.adapter.DocumentGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@Service
public class PdfGenerationService {

    @Autowired
    private DocumentGenerator documentGenerator;

    public byte[] generateDocument(Commande commande, TypeDocument type) throws IOException {
        String title;
        String content;

        switch (type) {
            case IMMATRICULATION:
                title = "DEMANDE D'IMMATRICULATION";
                content = buildDemandeImmatriculationContent(commande);
                break;
            case CESSION:
                title = "CERTIFICAT DE CESSION";
                content = buildCertificatCessionContent(commande);
                break;
            case BON_COMMANDE:
                title = "BON DE COMMANDE N°" + commande.getId();
                content = buildBonCommandeContent(commande);
                break;
            case FACTURE:
                title = "FACTURE N°" + commande.getId();
                content = buildFactureContent(commande);
                break;
            case CONTRAT_CREDIT:
                if (commande instanceof CommandeCredit) {
                    title = "CONTRAT DE CRÉDIT N°" + commande.getId();
                    content = buildContratCreditContent((CommandeCredit) commande);
                } else {
                    throw new IllegalArgumentException("La commande n'est pas une commande crédit");
                }
                break;
             
            default:
                throw new IllegalArgumentException("Type de document non supporté: " + type);
        }

        return documentGenerator.generatePdf(title, content);
    }

    private String buildDemandeImmatriculationContent(Commande commande) {
        StringBuilder content = new StringBuilder();
        
        content.append("Commande N°: ").append(commande.getId()).append("\n");
        content.append("Date: ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date())).append("\n\n");
        
        // Informations des véhicules
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("VÉHICULES À IMMATRICULER:\n");
            content.append("=========================\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                Vehicule vehicule = ligne.getVehicule();
                if (vehicule != null) {
                    content.append("\nVéhicule ").append(commande.getLignes().indexOf(ligne) + 1).append(":\n");
                    content.append("------------\n");
                    content.append("Marque: ").append(vehicule.getMarque()).append("\n");
                    content.append("Modèle: ").append(vehicule.getModele()).append("\n");
                    content.append("Type: ").append(vehicule.getType()).append("\n");
                    content.append("Énergie: ").append(vehicule.getEnergie()).append("\n");
                    content.append("Plaque d'immatriculation actuelle: [À REMPLIR]\n");
                    content.append("Nouvelle plaque: [À ATTRIBUER]\n");
                }
            }
        }
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("\n\nINFORMATIONS DU DEMANDEUR:\n");
            content.append("=========================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("Adresse: ").append(societe.getAdresse()).append("\n");
                content.append("Représentant légal: [NOM DU REPRÉSENTANT]\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
                content.append("Adresse: ").append(particulier.getAdresse()).append("\n");
                content.append("Téléphone: ").append(particulier.getTelephone()).append("\n");
                content.append("Date de naissance: [DATE DE NAISSANCE]\n");
                content.append("Lieu de naissance: [LIEU DE NAISSANCE]\n");
            }
        }
        
        content.append("\n\nLieu de livraison: ").append(commande.getPaysLivraison()).append("\n\n");
        
        content.append("Cachet et signature:\n");
        content.append("___________________");
        
        return content.toString();
    }

    private String buildCertificatCessionContent(Commande commande) {
        StringBuilder content = new StringBuilder();
        
        content.append("Je soussigné(e), représentant de Vehicules Online,\n");
        content.append("certifie avoir cédé le(s) véhicule(s) suivant(s):\n\n");
        
        // Informations des véhicules
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("LISTE DES VÉHICULES CÉDÉS:\n");
            content.append("==========================\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                Vehicule vehicule = ligne.getVehicule();
                if (vehicule != null) {
                    content.append("\nVéhicule ").append(commande.getLignes().indexOf(ligne) + 1).append(":\n");
                    content.append("------------\n");
                    content.append("Marque: ").append(vehicule.getMarque()).append("\n");
                    content.append("Modèle: ").append(vehicule.getModele()).append("\n");
                    content.append("Type: ").append(vehicule.getType()).append("\n");
                    content.append("Numéro de série: [À REMPLIR]\n");
                    content.append("Prix de cession: ").append(ligne.getPrixTotal()).append(" €\n");
                }
            }
        }
        
        // Informations client cessionnaire
        if (commande.getClient() != null) {
            content.append("\n\nINFORMATIONS DU CESSIONNAIRE:\n");
            content.append("============================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("Représentant légal: [NOM DU REPRÉSENTANT]\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
                content.append("Date de naissance: [DATE DE NAISSANCE]\n");
                content.append("Lieu de naissance: [LIEU DE NAISSANCE]\n");
            }
        }
        
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        content.append("\n\nFait à Paris, le ").append(sdf.format(new Date())).append("\n");
        
        content.append("\nPour le cédant, Vehicules Online:\n");
        content.append("___________________\n\n");
        
        content.append("Pour le cessionnaire:\n");
        content.append("___________________");
        
        return content.toString();
    }

    private String buildBonCommandeContent(Commande commande) {
        StringBuilder content = new StringBuilder();
        
        // En-tête
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        content.append("Date: ").append(sdf.format(commande.getDateCreation())).append("\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("INFORMATIONS CLIENT:\n");
            content.append("===================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            content.append("Type: ").append(commande.getClient().getType()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("Représentant légal: [NOM DU REPRÉSENTANT]\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
                content.append("Téléphone: ").append(particulier.getTelephone()).append("\n");
                content.append("Email: ").append(particulier.getEmail()).append("\n");
            }
            content.append("\n");
        }
        
        // Détails commande
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("DÉTAILS DE LA COMMANDE:\n");
            content.append("======================\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                Vehicule vehicule = ligne.getVehicule();
                if (vehicule != null) {
                    content.append("- ").append(vehicule.getMarque()).append(" ")
                          .append(vehicule.getModele()).append("\n");
                    content.append("  Quantité: ").append(ligne.getQuantite()).append("\n");
                    content.append("  Prix unitaire: ").append(ligne.getPrixUnitaire()).append(" €\n");
                    content.append("  Sous-total: ").append(ligne.getPrixTotal()).append(" €\n");
                    
                    // Options
                    if (ligne.getOptions() != null && !ligne.getOptions().isEmpty()) {
                        content.append("  Options incluses:\n");
                        for (OptionVehicule option : ligne.getOptions()) {
                            content.append("    • ").append(option.getNom())
                                  .append(" (").append(option.getPrix()).append(" €)\n");
                        }
                    }
                    content.append("\n");
                }
            }
        }
        
        // Total
        content.append("MONTANT TOTAL: ").append(commande.getMontantTotal() != null ? 
            commande.getMontantTotal() + " €" : "0 €").append("\n");
        content.append("Mode de paiement: ").append(commande.getTypePaiement()).append("\n");
        content.append("Livraison prévue dans: ").append(commande.getPaysLivraison()).append("\n\n");
        
        content.append("CONDITIONS GÉNÉRALES DE VENTE:\n");
        content.append("1. Le véhicule sera livré dans un délai de 15 jours ouvrables.\n");
        content.append("2. Toute annulation doit être notifiée par écrit.\n");
        content.append("3. La garantie est valable 24 mois à partir de la date de livraison.\n\n");
        
        content.append("Signature du client:\n");
        content.append("___________________\n\n");
        
        content.append("Cachet et signature Vehicules Online:\n");
        content.append("___________________");
        
        return content.toString();
    }

    private String buildFactureContent(Commande commande) {
        StringBuilder content = new StringBuilder();
        
        // En-tête
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        content.append("Date d'émission: ").append(sdf.format(new Date())).append("\n");
        content.append("Date de la commande: ").append(sdf.format(commande.getDateCreation())).append("\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("FACTURÉ À:\n");
            content.append("==========\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("TVA Intracommunautaire: [N° TVA]\n");
                content.append("Adresse: ").append(societe.getAdresse()).append("\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
                content.append("Adresse: ").append(particulier.getAdresse()).append("\n");
            }
            content.append("\n");
        }
        
        // Détails de la facture
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            content.append("DÉTAILS DE LA FACTURE:\n");
            content.append("=====================\n");
            content.append("Désignation\tQté\tPrix unitaire\tTotal HT\n");
            content.append("-----------\t---\t-------------\t--------\n");
            
            for (LigneCommande ligne : commande.getLignes()) {
                Vehicule vehicule = ligne.getVehicule();
                if (vehicule != null) {
                    content.append(vehicule.getMarque()).append(" ").append(vehicule.getModele())
                          .append("\t").append(ligne.getQuantite())
                          .append("\t").append(ligne.getPrixUnitaire()).append(" €")
                          .append("\t").append(ligne.getPrixTotal()).append(" €\n");
                    
                    // Options
                    if (ligne.getOptions() != null && !ligne.getOptions().isEmpty()) {
                        for (OptionVehicule option : ligne.getOptions()) {
                            content.append("  + ").append(option.getNom())
                                  .append("\t1\t").append(option.getPrix()).append(" €")
                                  .append("\t").append(option.getPrix()).append(" €\n");
                        }
                    }
                }
            }
            content.append("\n");
        }
        
        // Calculs
        BigDecimal sousTotal = commande.getMontantTotal() != null ? 
            commande.getMontantTotal() : BigDecimal.ZERO;
        BigDecimal tva = sousTotal.multiply(new BigDecimal("0.20"));
        BigDecimal totalTTC = sousTotal.add(tva);
        
        content.append("\nSOUS-TOTAL HT: ").append(sousTotal).append(" €\n");
        content.append("TVA (20%): ").append(tva).append(" €\n");
        content.append("TOTAL TTC: ").append(totalTTC).append(" €\n\n");
        
        content.append("Date d'échéance: ").append(sdf.format(new Date())).append("\n");
        content.append("Mode de règlement: ").append(commande.getTypePaiement()).append("\n\n");
        
        content.append("Signature:\n");
        content.append("___________________");
        
        return content.toString();
    }

    private String buildContratCreditContent(CommandeCredit commande) {
        StringBuilder content = new StringBuilder();
        
        content.append("Date: ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date())).append("\n\n");
        
        // Informations crédit
        content.append("DÉTAILS DU CRÉDIT:\n");
        content.append("=================\n");
        content.append("Montant financé: ").append(commande.getMontantTotal()).append(" €\n");
        content.append("Durée: ").append(commande.getDureeMois()).append(" mois\n");
        content.append("Taux d'intérêt annuel: ").append(commande.getTauxInteret()).append(" %\n");
        
        // CORRECTION APPLIQUÉE ICI
        // Obtenir la valeur du taux d'intérêt selon son type
        BigDecimal tauxInteretBigDecimal;
        Object tauxInteretObj = commande.getTauxInteret();
        
        if (tauxInteretObj instanceof BigDecimal) {
            tauxInteretBigDecimal = (BigDecimal) tauxInteretObj;
        } else if (tauxInteretObj instanceof Double) {
            tauxInteretBigDecimal = BigDecimal.valueOf((Double) tauxInteretObj);
        } else if (tauxInteretObj instanceof Integer) {
            tauxInteretBigDecimal = BigDecimal.valueOf((Integer) tauxInteretObj);
        } else if (tauxInteretObj instanceof Long) {
            tauxInteretBigDecimal = BigDecimal.valueOf((Long) tauxInteretObj);
        } else if (tauxInteretObj instanceof String) {
            tauxInteretBigDecimal = new BigDecimal((String) tauxInteretObj);
        } else {
            tauxInteretBigDecimal = BigDecimal.ZERO;
        }
        
        BigDecimal tauxMensuel = tauxInteretBigDecimal.divide(new BigDecimal("12"), 4, RoundingMode.HALF_UP);
        content.append("Taux d'intérêt mensuel: ").append(tauxMensuel).append(" %\n");
        
        // Calculs détaillés
        BigDecimal montant = commande.getMontantTotal();
        BigDecimal tauxMensuelDecimal = tauxInteretBigDecimal
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
        
        content.append("\nCALCUL DES MENSUALITÉS:\n");
        content.append("=====================\n");
        content.append("Mensualité: ").append(mensualite).append(" €\n");
        content.append("Nombre de mensualités: ").append(duree).append("\n");
        content.append("Montant total dû: ").append(mensualite.multiply(BigDecimal.valueOf(duree))).append(" €\n");
        content.append("Coût total du crédit: ").append(coutTotalCredit).append(" €\n");
        content.append("TEG (Taux Effectif Global): ").append(commande.getTauxInteret()).append(" %\n\n");
        
        // Informations client
        if (commande.getClient() != null) {
            content.append("INFORMATIONS DE L'EMPRUNTEUR:\n");
            content.append("===========================\n");
            content.append("Nom: ").append(commande.getClient().getNom()).append("\n");
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                content.append("Raison sociale: ").append(societe.getRaisonSociale()).append("\n");
                content.append("SIRET: ").append(societe.getSiret()).append("\n");
                content.append("Forme juridique: [FORME JURIDIQUE]\n");
                content.append("Capital social: [CAPITAL SOCIAL] €\n");
            } else if (commande.getClient() instanceof ClientParticulier) {
                ClientParticulier particulier = (ClientParticulier) commande.getClient();
                content.append("Prénom: ").append(particulier.getPrenom()).append("\n");
                content.append("Profession: [PROFESSION]\n");
                content.append("Revenus mensuels: [REVENUS MENSUELS] €\n");
            }
        }
        
        // Clauses du contrat
        content.append("\n\nCLAUSES DU CONTRAT:\n");
        content.append("==================\n");
        content.append("ARTICLE 1 - OBJET\n");
        content.append("Le présent contrat a pour objet l'octroi d'un crédit à la consommation.\n\n");
        
        content.append("ARTICLE 2 - DURÉE\n");
        content.append("Le crédit est consenti pour une durée de ").append(duree).append(" mois.\n\n");
        
        content.append("ARTICLE 3 - TAUX ET FRAIS\n");
        content.append("Le taux d'intérêt est fixe pour toute la durée du crédit.\n\n");
        
        content.append("ARTICLE 4 - REMBOURSEMENT\n");
        content.append("Le remboursement s'effectue par ").append(duree).append(" mensualités de ")
              .append(mensualite).append(" € chacune.\n\n");
        
        content.append("ARTICLE 5 - DÉFAUT DE PAIEMENT\n");
        content.append("En cas de retard de paiement, des pénalités seront appliquées.\n\n");
        
        content.append("Signature de l'emprunteur:\n");
        content.append("___________________\n\n");
        
        content.append("Signature du prêteur:\n");
        content.append("___________________\n\n");
        
        content.append("Date et lieu: Paris, le ").append(new SimpleDateFormat("dd/MM/yyyy").format(new Date()));
        
        return content.toString();
    }

    // Méthode supplémentaire pour générer des documents HTML (démontre la flexibilité)
    public String generateDocumentHtml(Commande commande, TypeDocument type) throws IOException {
        String title;
        String content;

        switch (type) {
            case IMMATRICULATION:
                title = "Demande d'immatriculation";
                content = buildDemandeImmatriculationContent(commande);
                break;
            case CESSION:
                title = "Certificat de cession";
                content = buildCertificatCessionContent(commande);
                break;
            default:
                title = "Document";
                content = "Contenu générique pour la commande N°" + commande.getId();
        }

        return documentGenerator.generateHtml(title, content);
    }
}