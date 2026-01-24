package com.vehicules.controllers;

import com.vehicules.core.entities.Commande;
import com.vehicules.pdf.dto.PdfRequestDTO;
import com.vehicules.pdf.dto.PdfResponseDTO;
import com.vehicules.pdf.dto.LiasseViergeDTO;
import com.vehicules.pdf.services.DocumentService;
import com.vehicules.pdf.services.LiasseViergeService;
import com.vehicules.repositories.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PdfController {
    
    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private LiasseViergeService liasseViergeService;
    
    @PostMapping("/generate")
    public ResponseEntity<PdfResponseDTO> generatePdf(@RequestBody PdfRequestDTO request) {
        try {
            Commande commande = commandeRepository.findById(request.getCommandeId())
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            byte[] pdfContent = documentService.generateDocumentByType(commande, request.getDocumentType());
            
            PdfResponseDTO response = new PdfResponseDTO();
            response.setDocumentId(UUID.randomUUID().toString());
            response.setDocumentType(request.getDocumentType());
            response.setDownloadUrl("/api/pdf/download/" + request.getCommandeId() + "/" + request.getDocumentType());
            response.setFileSize(pdfContent.length);
            response.setGeneratedAt(new Date().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
    
    @GetMapping("/download/{commandeId}/{documentType}")
    public ResponseEntity<ByteArrayResource> downloadPdf(
            @PathVariable Long commandeId,
            @PathVariable String documentType) {

        try {
            Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            byte[] pdfContent = documentService.generateDocumentByType(commande, documentType);
            
            String filename = getFilename(documentType, commandeId.toString());
            
            ByteArrayResource resource = new ByteArrayResource(pdfContent);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfContent.length)
                .body(resource);
            
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du téléchargement du PDF", e);
        }
    }
    
    @GetMapping("/liasse/{commandeId}")
    public ResponseEntity<List<PdfResponseDTO>> generateLiasse(@PathVariable Long commandeId) {
        try {
            Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            List<byte[]> documents = documentService.generateAllDocuments(commande);
            List<PdfResponseDTO> responses = new ArrayList<>();
            
            String[] documentTypes = {"DEMANDE_IMMATRICULATION", "CERTIFICAT_CESSION", "BON_COMMANDE"};
            
            for (int i = 0; i < documents.size(); i++) {
                PdfResponseDTO response = new PdfResponseDTO();
                response.setDocumentId(UUID.randomUUID().toString());
                response.setDocumentType(documentTypes[i]);
                response.setDownloadUrl("/api/pdf/download/" + commandeId + "/" + documentTypes[i]);
                response.setFileSize(documents.get(i).length);
                response.setGeneratedAt(new Date().toString());
                
                responses.add(response);
            }
            
            return ResponseEntity.ok(responses);
            
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération de la liasse", e);
        }
    }
    
    @GetMapping("/liasse-vierge")
    public ResponseEntity<LiasseViergeDTO> getLiasseVierge() {
        List<String> documents = liasseViergeService.getDocumentsVierges();
        
        LiasseViergeDTO response = new LiasseViergeDTO();
        response.setDocuments(documents);
        response.setGeneratedAt(new Date().toString());
        response.setMessage("Liasse vierge générée avec succès");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/document-vierge/{documentType}")
    public ResponseEntity<ByteArrayResource> downloadDocumentVierge(
            @PathVariable String documentType) {
        
        byte[] pdfContent = liasseViergeService.generateDocumentVierge(documentType);
        
        String filename = "document_vierge_" + documentType.toLowerCase() + ".pdf";
        
        ByteArrayResource resource = new ByteArrayResource(pdfContent);
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(pdfContent.length)
            .body(resource);
    }
    
    @PostMapping("/liasse-vierge/reinitialiser")
    public ResponseEntity<String> reinitialiserLiasseVierge() {
        liasseViergeService.reinitialiserLiasse();
        return ResponseEntity.ok("Liasse vierge réinitialisée avec succès");
    }
    
    @GetMapping("/preview/{commandeId}/{documentType}")
    public ResponseEntity<String> previewHtml(
            @PathVariable Long commandeId,
            @PathVariable String documentType) {

        try {
            Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            String title = getDocumentTitle(documentType);
            String content = getDocumentContent(commande, documentType);
            
            // Génération HTML simplifiée sans dépendre à l'adaptateur
            String html = generateSimpleHtml(title, content);
            
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de l'aperçu HTML", e);
        }
    }
    
    // Nouvelle méthode pour générer du HTML simple
    private String generateSimpleHtml(String title, String content) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "<title>" + title + "</title>" +
               "<style>" +
               "body { font-family: Arial, sans-serif; margin: 40px; }" +
               "h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }" +
               ".content { white-space: pre-line; background-color: #f9f9f9; padding: 20px; border-radius: 5px; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "<h1>" + title + "</h1>" +
               "<div class=\"content\">" + content.replace("\n", "<br>") + "</div>" +
               "</body>" +
               "</html>";
    }
    
    private String getFilename(String documentType, String commandeId) {
        String prefix = "";
        switch (documentType.toUpperCase()) {
            case "DEMANDE_IMMATRICULATION":
                prefix = "demande_immatriculation";
                break;
            case "CERTIFICAT_CESSION":
                prefix = "certificat_cession";
                break;
            case "BON_COMMANDE":
                prefix = "bon_commande";
                break;
            default:
                prefix = "document";
        }
        return prefix + "_" + commandeId + ".pdf";
    }
    
    private String getDocumentTitle(String documentType) {
        switch (documentType.toUpperCase()) {
            case "DEMANDE_IMMATRICULATION":
                return "Demande d'immatriculation";
            case "CERTIFICAT_CESSION":
                return "Certificat de cession";
            case "BON_COMMANDE":
                return "Bon de commande";
            default:
                return "Document";
        }
    }
    
    private String getDocumentContent(Commande commande, String documentType) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        StringBuilder content = new StringBuilder();
        
        content.append("Document: ").append(documentType).append("\n");
        content.append("Commande N°: ").append(commande.getId()).append("\n");
        content.append("Client: ").append(commande.getClient() != null ? commande.getClient().getNom() : "Non spécifié").append("\n");
        content.append("Date: ").append(sdf.format(new Date())).append("\n");
        content.append("\n---\n");
        content.append("Ceci est un aperçu HTML du document.\n");
        content.append("Le document PDF complet sera généré sur demande.");
        
        return content.toString();
    }
    
    // Endpoint de test simplifié
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Service PDF fonctionnel - Prêt à générer des documents");
    }
    
    // Endpoint de santé
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Service PDF en ligne - " + new Date());
    }
}