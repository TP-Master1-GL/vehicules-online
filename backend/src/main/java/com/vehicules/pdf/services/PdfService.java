package com.vehicules.pdf.services;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Vehicule;
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
        document.add(new Paragraph("\nInformations du client:")
            .setBold());
        
        Table tableClient = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        tableClient.addCell("Nom");
        tableClient.addCell(commande.getClient().getNom());
        tableClient.addCell("Email");
        tableClient.addCell(commande.getClient().getEmail());
        tableClient.addCell("Téléphone");
        tableClient.addCell(commande.getClient().getTelephone());
        
        document.add(tableClient);
        
        // Date et signature
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        document.add(new Paragraph("\n\nFait le: " + sdf.format(new Date())));
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
        
        Paragraph details = new Paragraph()
            .add("\nMarque: " + vehicule.getMarque())
            .add("\nModèle: " + vehicule.getModele())
            .add("\nType: " + vehicule.getType())
            .add("\nPrix: " + vehicule.getPrixBase() + " €");
        
        document.add(details);
        
        document.add(new Paragraph("\nÀ: ")
            .add(commande.getClient().getNom())
            .add("\n" + commande.getClient().getEmail()));
        
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        document.add(new Paragraph("\n\nLe " + sdf.format(commande.getDateCreation())));
        
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
        
        // Détails commande
        document.add(new Paragraph("\nDÉTAILS DE LA COMMANDE:")
            .setBold());
        
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2})).useAllAvailableWidth();
        table.addHeaderCell("Désignation");
        table.addHeaderCell("Quantité");
        table.addHeaderCell("Prix Unitaire");
        
        commande.getLignes().forEach(ligne -> {
            table.addCell(ligne.getVehicule().getMarque() + " " + ligne.getVehicule().getModele());
            table.addCell("1");
            table.addCell(ligne.getPrixTotal() + " €");
        });
        
        document.add(table);
        
        // Total
        document.add(new Paragraph("\n\nTOTAL: " + commande.getMontantTotal() + " €")
            .setBold()
            .setFontSize(14));
        
        // Mode de paiement
        String modePaiement = commande instanceof com.vehicules.core.entities.CommandeComptant ? 
            "Comptant" : "Crédit";
        document.add(new Paragraph("Mode de paiement: " + modePaiement));
        
        document.add(new Paragraph("\n\nSignature du client:"));
        document.add(new Paragraph("\n___________________"));
        
        document.close();
        return baos.toByteArray();
    }
    
    public byte[] genererCataloguePdf() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        document.add(new Paragraph("CATALOGUE VÉHICULES")
            .setBold()
            .setFontSize(20)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
        
        document.add(new Paragraph("Date d'édition: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date()))
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

        document.close();
        return baos.toByteArray();
    }
}