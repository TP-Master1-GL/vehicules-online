// src/main/java/com/vehicules/pdf/services/PdfService.java
package com.vehicules.pdf.services;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.vehicules.core.entities.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class PdfService {
    
    public byte[] genererDemandeImmatriculation(Commande commande, Vehicule vehicule) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        // Titre
        document.add(new Paragraph("DEMANDE D'IMMATRICULATION")
            .setBold()
            .setFontSize(16));
        
        // Informations commande
        document.add(new Paragraph("Commande N°: " + commande.getId()));
        document.add(new Paragraph("Date: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date())));
        
        // Informations véhicule
        document.add(new Paragraph("\nInformations du véhicule:")
            .setBold());
        
        Table tableVehicule = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        tableVehicule.addCell("Marque");
        tableVehicule.addCell(vehicule.getMarque());
        tableVehicule.addCell("Modèle");
        tableVehicule.addCell(vehicule.getModele());
        tableVehicule.addCell("Type");
        tableVehicule.addCell(vehicule.getType());
        tableVehicule.addCell("Énergie");
        tableVehicule.addCell(vehicule.getEnergie());
        
        document.add(tableVehicule);
        
        // Informations client
        if (commande.getClient() != null) {
            document.add(new Paragraph("\nInformations du client:")
                .setBold());
            
            Table tableClient = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
            tableClient.addCell("Nom");
            tableClient.addCell(commande.getClient().getNom());
            tableClient.addCell("Type");
            tableClient.addCell(commande.getClient().getType());
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                tableClient.addCell("Raison sociale");
                tableClient.addCell(societe.getRaisonSociale());
                tableClient.addCell("SIRET");
                tableClient.addCell(societe.getSiret());
            }
            
            document.add(tableClient);
        }
        
        document.add(new Paragraph("\n\nSignature: ___________________"));
        
        document.close();
        return baos.toByteArray();
    }
    
    public byte[] genererCertificatCession(Commande commande, Vehicule vehicule) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        document.add(new Paragraph("CERTIFICAT DE CESSION")
            .setBold()
            .setFontSize(16));
        
        document.add(new Paragraph("\nJe soussigné(e), représentant de Vehicules Online,"));
        document.add(new Paragraph("certifie avoir cédé le véhicule suivant:"));
        
        document.add(new Paragraph("\nDÉSIGNATION DU VÉHICULE:")
            .setBold());
        
        // Informations véhicule
        document.add(new Paragraph("Marque: " + vehicule.getMarque()));
        document.add(new Paragraph("Modèle: " + vehicule.getModele()));
        document.add(new Paragraph("Type: " + vehicule.getType()));
        
        // Informations client
        if (commande.getClient() != null) {
            document.add(new Paragraph("\nÀ: " + commande.getClient().getNom()));
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                document.add(new Paragraph("Raison sociale: " + societe.getRaisonSociale()));
                document.add(new Paragraph("SIRET: " + societe.getSiret()));
            }
        }
        
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        document.add(new Paragraph("\n\nLe " + sdf.format(new Date())));
        
        document.add(new Paragraph("\n\nCachet et signature du cédant:"));
        document.add(new Paragraph("\n___________________"));
        
        document.close();
        return baos.toByteArray();
    }
    
    public byte[] genererBonCommande(Commande commande) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        document.add(new Paragraph("BON DE COMMANDE N°" + commande.getId())
            .setBold()
            .setFontSize(16));
        
        // En-tête
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        document.add(new Paragraph("Date: " + sdf.format(commande.getDateCreation())));
        
        // Informations client
        if (commande.getClient() != null) {
            document.add(new Paragraph("\nCLIENT:"));
            document.add(new Paragraph("Nom: " + commande.getClient().getNom()));
            document.add(new Paragraph("Type: " + commande.getClient().getType()));
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                document.add(new Paragraph("Raison sociale: " + societe.getRaisonSociale()));
                document.add(new Paragraph("SIRET: " + societe.getSiret()));
            }
        }
        
        // Détails commande
        if (commande.getLignes() != null && !commande.getLignes().isEmpty()) {
            document.add(new Paragraph("\nDÉTAILS DE LA COMMANDE:")
                .setBold());
            
            Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2})).useAllAvailableWidth();
            table.addHeaderCell("Désignation");
            table.addHeaderCell("Quantité");
            table.addHeaderCell("Prix Unitaire");
            
            for (LigneCommande ligne : commande.getLignes()) {
                table.addCell(ligne.getVehicule().getMarque() + " " + ligne.getVehicule().getModele());
                table.addCell(String.valueOf(ligne.getQuantite()));
                table.addCell(ligne.getPrixUnitaire() + " €");
            }
            
            document.add(table);
        }
        
        // Total
        document.add(new Paragraph("\n\nTOTAL: " + 
            (commande.getMontantTotal() != null ? commande.getMontantTotal() + " €" : "0 €"))
            .setBold()
            .setFontSize(14));
        
        document.add(new Paragraph("\n\nSignature du client:"));
        document.add(new Paragraph("\n___________________"));
        
        document.close();
        return baos.toByteArray();
    }
    
    public byte[] genererFacture(Commande commande) throws IOException {
        return genererBonCommande(commande); // Pour l'instant, même contenu
    }
    
    public byte[] genererContratCredit(CommandeCredit commande) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        document.add(new Paragraph("CONTRAT DE CRÉDIT")
            .setBold()
            .setFontSize(16));
        
        document.add(new Paragraph("\nContrat N°: " + commande.getId()));
        document.add(new Paragraph("Date: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date())));
        
        // Informations crédit
        if (commande.getFinancement() != null) {
            document.add(new Paragraph("\nDÉTAILS DU FINANCEMENT:")
                .setBold());
            
            document.add(new Paragraph("Montant financé: " + commande.getMontantTotal() + " €"));
            document.add(new Paragraph("Durée: " + ((CommandeCredit) commande).getDureeMois() + " mois"));
            document.add(new Paragraph("Taux: " + ((CommandeCredit) commande).getTauxInteret() + " %"));
            document.add(new Paragraph("Mensualité: " + ((CommandeCredit) commande).getTauxInteret() + " €"));
        }
        
        // Informations client
        if (commande.getClient() != null) {
            document.add(new Paragraph("\nINFORMATIONS EMPRUNTEUR:")
                .setBold());
            
            document.add(new Paragraph("Nom: " + commande.getClient().getNom()));
            
            if (commande.getClient() instanceof Societe) {
                Societe societe = (Societe) commande.getClient();
                document.add(new Paragraph("Raison sociale: " + societe.getRaisonSociale()));
                document.add(new Paragraph("SIRET: " + societe.getSiret()));
            }
        }
        
        document.add(new Paragraph("\n\nSignature de l'emprunteur:"));
        document.add(new Paragraph("\n___________________"));
        
        document.add(new Paragraph("\n\nSignature du prêteur:"));
        document.add(new Paragraph("\n___________________"));
        
        document.close();
        return baos.toByteArray();
    }
}