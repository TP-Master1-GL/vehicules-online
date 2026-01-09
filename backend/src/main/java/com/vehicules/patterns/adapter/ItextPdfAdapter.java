package com.vehicules.patterns.adapter;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class ItextPdfAdapter implements DocumentGenerator {
    
    @Override
    public byte[] generatePdf(String title, String content) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            // Ajouter le titre
            document.add(new Paragraph(title)
                .setBold()
                .setFontSize(16));
            
            // Ajouter le contenu
            document.add(new Paragraph("\n" + content));
            
            document.close();
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération PDF", e);
        }
    }
    
    @Override
    public String generateHtml(String title, String content) {
        return "<!DOCTYPE html>\n" +
               "<html>\n" +
               "<head>\n" +
               "    <title>" + title + "</title>\n" +
               "    <style>\n" +
               "        body { font-family: Arial, sans-serif; margin: 40px; }\n" +
               "        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }\n" +
               "        .content { margin-top: 20px; line-height: 1.6; }\n" +
               "    </style>\n" +
               "</head>\n" +
               "<body>\n" +
               "    <h1>" + title + "</h1>\n" +
               "    <div class=\"content\">\n" +
               "        " + content.replace("\n", "<br>") + "\n" +
               "    </div>\n" +
               "</body>\n" +
               "</html>";
    }
    
    @Override
    public void saveToFile(byte[] pdfContent, String filePath) {
        try {
            java.nio.file.Files.write(
                java.nio.file.Paths.get(filePath),
                pdfContent
            );
            System.out.println("PDF sauvegardé à: " + filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde du PDF", e);
        }
    }
}