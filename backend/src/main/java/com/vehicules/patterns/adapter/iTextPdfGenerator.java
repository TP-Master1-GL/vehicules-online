// src/main/java/com/vehicules/patterns/adapter/iTextPdfGenerator.java
package com.vehicules.patterns.adapter;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;

public class iTextPdfGenerator {
    private PdfDocument pdfDoc;
    private Document document;
    
    public byte[] createPdf(String content) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            
            this.pdfDoc = new PdfDocument(writer);
            this.document = new Document(pdfDoc);
            
            // Ajouter le contenu au document
            document.add(new Paragraph(content));
            
            // Fermer le document
            document.close();
            pdfDoc.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du PDF", e);
        }
    }
    
    public void saveToFile(byte[] pdfContent, String filePath) {
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(pdfContent);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la sauvegarde du fichier PDF", e);
        }
    }
}