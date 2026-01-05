package com.vehicules.patterns.builder;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PdfBuilder implements DocumentBuilder {
    
    private final ByteArrayOutputStream outputStream;
    private final Document document;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    public PdfBuilder() {
        this.outputStream = new ByteArrayOutputStream();
        PdfDocument pdf = new PdfDocument(new PdfWriter(outputStream));
        this.document = new Document(pdf);
        this.document.setMargins(50, 50, 50, 50);
    }
    
    @Override
    public void ajouterDemandeImmatriculation(String orderId) {
        // En-tête
        document.add(new Paragraph("REPUBLIQUE FRANÇAISE")
            .setFontSize(10)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
        
        document.add(new Paragraph("MINISTÈRE DE L'INTÉRIEUR")
            .setFontSize(10)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
        
        document.add(new Paragraph("DEMANDE D'IMMATRICULATION DE VÉHICULE")
            .setBold()
            .setFontSize(16)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
            .setMarginTop(20)
            .setMarginBottom(30));
        
        // Informations
        document.add(new Paragraph("1. INFORMATIONS SUR LA COMMANDE")
            .setBold()
            .setMarginBottom(10));
        
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{2, 3}));
        infoTable.setWidth(UnitValue.createPercentValue(100));
        
        infoTable.addCell("Numéro de commande:");
        infoTable.addCell(orderId);
        
        infoTable.addCell("Date de la demande:");
        infoTable.addCell(LocalDate.now().format(formatter));
        
        infoTable.addCell("Service instructeur:");
        infoTable.addCell("Préfecture de Paris");
        
        document.add(infoTable);
        
        document.add(new Paragraph("\n2. CARACTÉRISTIQUES DU VÉHICULE")
            .setBold()
            .setMarginTop(20)
            .setMarginBottom(10));
        
        Table vehicleTable = new Table(UnitValue.createPercentArray(new float[]{2, 3}));
        vehicleTable.setWidth(UnitValue.createPercentValue(100));
        
        vehicleTable.addCell("Marque:");
        vehicleTable.addCell("TESLA");
        
        vehicleTable.addCell("Modèle:");
        vehicleTable.addCell("Model 3");
        
        vehicleTable.addCell("Type:");
        vehicleTable.addCell("Automobile électrique");
        
        vehicleTable.addCell("Numéro de série:");
        vehicleTable.addCell("5YJ3E1EAXJF123456");
        
        vehicleTable.addCell("Puissance (kW):");
        vehicleTable.addCell("239");
        
        vehicleTable.addCell("Cylindrée:");
        vehicleTable.addCell("0 cm³ (électrique)");
        
        document.add(vehicleTable);
        
        // Signature
        document.add(new Paragraph("\n\nFait à Paris, le " + LocalDate.now().format(formatter))
            .setMarginTop(30));
        
        document.add(new Paragraph("\n\nSignature et cachet:")
            .setMarginTop(50));
        
        document.add(new Paragraph("________________________________")
            .setMarginTop(20));
        
        // Saut de page pour le document suivant
        document.add(new com.itextpdf.layout.element.AreaBreak(
            com.itextpdf.layout.properties.AreaBreakType.NEXT_PAGE));
    }
    
    @Override
    public void ajouterCertificatCession(String orderId) {
        document.add(new Paragraph("CERTIFICAT DE CESSION DE VÉHICULE")
            .setBold()
            .setFontSize(16)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
            .setMarginBottom(30));
        
        document.add(new Paragraph("Je soussigné(e) :")
            .setMarginBottom(10));
        
        document.add(new Paragraph("[NOM DU VENDEUR / CONCESSIONNAIRE]")
            .setUnderline()
            .setMarginBottom(20));
        
        document.add(new Paragraph("déclare céder le véhicule décrit ci-dessous à :")
            .setMarginBottom(10));
        
        document.add(new Paragraph("[NOM DE L'ACHETEUR]")
            .setUnderline()
            .setMarginBottom(30));
        
        document.add(new Paragraph("DÉTAIL DU VÉHICULE CÉDÉ")
            .setBold()
            .setMarginBottom(10));
        
        Table detailTable = new Table(UnitValue.createPercentArray(new float[]{2, 3}));
        detailTable.setWidth(UnitValue.createPercentValue(100));
        
        detailTable.addCell("Marque/Modèle:");
        detailTable.addCell("TESLA Model 3");
        
        detailTable.addCell("Type:");
        detailTable.addCell("Automobile électrique");
        
        detailTable.addCell("N° de série:");
        detailTable.addCell("5YJ3E1EAXJF123456");
        
        detailTable.addCell("Date 1ère immat.:");
        detailTable.addCell(LocalDate.now().minusMonths(1).format(formatter));
        
        detailTable.addCell("Kilométrage:");
        detailTable.addCell("50 km (neuf)");
        
        detailTable.addCell("Prix de cession:");
        detailTable.addCell("45 000 € HT");
        
        document.add(detailTable);
        
        document.add(new Paragraph("\nCONDITIONS DE LA CESSION")
            .setBold()
            .setMarginTop(20)
            .setMarginBottom(10));
        
        document.add(new Paragraph("1. Le véhicule est vendu en l'état, sans garantie autre que légale.")
            .setMarginBottom(5));
        
        document.add(new Paragraph("2. La propriété est transférée à compter de la signature.")
            .setMarginBottom(5));
        
        document.add(new Paragraph("3. Les frais d'immatriculation sont à la charge de l'acquéreur.")
            .setMarginBottom(20));
        
        document.add(new Paragraph("Fait à Paris, le " + LocalDate.now().format(formatter))
            .setMarginTop(30));
        
        document.add(new Paragraph("\n\nLe Cédant")
            .setMarginTop(40));
        
        document.add(new Paragraph("________________________________")
            .setMarginTop(5));
        
        document.add(new Paragraph("\n\nL'Acquéreur")
            .setMarginTop(20));
        
        document.add(new Paragraph("________________________________")
            .setMarginTop(5));
        
        document.add(new com.itextpdf.layout.element.AreaBreak(
            com.itextpdf.layout.properties.AreaBreakType.NEXT_PAGE));
    }
    
    @Override
    public void ajouterBonCommande(String orderId) {
        document.add(new Paragraph("BON DE COMMANDE N° " + orderId)
            .setBold()
            .setFontSize(18)
            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
            .setMarginBottom(30));
        
        document.add(new Paragraph("Client: [NOM DU CLIENT]")
            .setMarginBottom(5));
        
        document.add(new Paragraph("Adresse: [ADRESSE DE LIVRAISON]")
            .setMarginBottom(20));
        
        document.add(new Paragraph("DÉTAIL DE LA COMMANDE")
            .setBold()
            .setMarginBottom(15));
        
        // Tableau des articles
        Table orderTable = new Table(UnitValue.createPercentArray(new float[]{1, 3, 1, 1}));
        orderTable.setWidth(UnitValue.createPercentValue(100));
        
        // En-têtes
        orderTable.addHeaderCell("Qté");
        orderTable.addHeaderCell("Désignation");
        orderTable.addHeaderCell("Prix U.");
        orderTable.addHeaderCell("Total");
        
        // Véhicule
        orderTable.addCell("1");
        orderTable.addCell("TESLA Model 3 - Automobile électrique\nCouleur: Rouge\nBatterie: Long Range");
        orderTable.addCell("45 000 €");
        orderTable.addCell("45 000 €");
        
        // Options
        orderTable.addCell("1");
        orderTable.addCell("Sièges chauffants avant et arrière");
        orderTable.addCell("1 200 €");
        orderTable.addCell("1 200 €");
        
        orderTable.addCell("1");
        orderTable.addCell("Toit vitré panoramique");
        orderTable.addCell("1 500 €");
        orderTable.addCell("1 500 €");
        
        orderTable.addCell("1");
        orderTable.addCell("Peinture métallisée");
        orderTable.addCell("800 €");
        orderTable.addCell("800 €");
        
        orderTable.addCell("1");
        orderTable.addCell("Jantes 19\" Sport");
        orderTable.addCell("2 000 €");
        orderTable.addCell("2 000 €");
        
        // Ligne vide
        orderTable.addCell("");
        orderTable.addCell("");
        orderTable.addCell("");
        orderTable.addCell("");
        
        // Sous-total
        orderTable.addCell("");
        orderTable.addCell("SOUS-TOTAL HT");
        orderTable.addCell("");
        orderTable.addCell("50 500 €");
        
        // TVA
        orderTable.addCell("");
        orderTable.addCell("TVA (20%)");
        orderTable.addCell("");
        orderTable.addCell("10 100 €");
        
        // Livraison
        orderTable.addCell("1");
        orderTable.addCell("Livraison express (48h)");
        orderTable.addCell("500 €");
        orderTable.addCell("500 €");
        
        // Total
        orderTable.addCell("");
        orderTable.addCell("TOTAL TTC")
            .setBold()
            .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY);
        orderTable.addCell("");
        orderTable.addCell("61 100 €")
            .setBold()
            .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY);
        
        document.add(orderTable);
        
        // Conditions
        document.add(new Paragraph("\nCONDITIONS DE PAIEMENT")
            .setBold()
            .setMarginTop(20)
            .setMarginBottom(10));
        
        document.add(new Paragraph("• 30% à la commande")
            .setMarginBottom(5));
        
        document.add(new Paragraph("• 70% à la livraison")
            .setMarginBottom(20));
        
        document.add(new Paragraph("LIVRAISON PRÉVUE")
            .setBold()
            .setMarginTop(15)
            .setMarginBottom(10));
        
        document.add(new Paragraph("Date: " + LocalDate.now().plusWeeks(2).format(formatter))
            .setMarginBottom(5));
        
        document.add(new Paragraph("Lieu: [ADRESSE DE LIVRAISON]")
            .setMarginBottom(20));
        
        // Signature
        document.add(new Paragraph("\n\nPour acceptation,")
            .setMarginTop(30));
        
        document.add(new Paragraph("Fait à Paris, le " + LocalDate.now().format(formatter))
            .setMarginTop(10));
        
        document.add(new Paragraph("\n\nLe Client")
            .setMarginTop(40));
        
        document.add(new Paragraph("________________________________")
            .setMarginTop(5)
            .setMarginBottom(30));
        
        document.add(new Paragraph("Cachet et signature du vendeur")
            .setMarginTop(20));
    }
    
    @Override
    public LiassePDF getLiasse() {
        document.close();
        return new LiassePDF(outputStream.toByteArray());
    }
}