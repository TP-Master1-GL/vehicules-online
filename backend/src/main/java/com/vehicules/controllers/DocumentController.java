package com.vehicules.controllers;

import com.vehicules.services.DocumentService;
import com.vehicules.patterns.builder.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Documents", description = "Génération des liasses de documents")
@CrossOrigin(origins = "http://localhost:5173") // Pour Vite/React
public class DocumentController {

    private final DocumentService documentService;
    private final LiasseDirector liasseDirector;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
        this.liasseDirector = new LiasseDirector();
    }

    @Operation(summary = "Générer une liasse PDF complète")
    @PostMapping("/generate-pdf")
    public ResponseEntity<Map<String, Object>> generatePdfLiasse(@RequestBody DocumentRequest request) {
        try {
            // Utilisation du Builder PDF
            PdfBuilder pdfBuilder = new PdfBuilder();
            liasseDirector.setBuilder(pdfBuilder);
            
            // Construction selon le type
            if ("complete".equals(request.getLiasseType())) {
                liasseDirector.constructLiasseComplete(request.getOrderId());
            } else {
                liasseDirector.constructLiasseMinimale(request.getOrderId());
            }
            
            // Récupération du résultat
            LiassePDF liasse = pdfBuilder.getLiasse();
            byte[] pdfContent = liasse.generer();
            
            // Sauvegarde en base
            String documentId = documentService.saveDocument(
                request.getOrderId(), 
                pdfContent, 
                "PDF", 
                "liasse_complete"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "documentId", documentId,
                "message", "Liasse PDF générée avec succès",
                "size", pdfContent.length
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @Operation(summary = "Générer une liasse HTML")
    @PostMapping("/generate-html")
    public ResponseEntity<Map<String, Object>> generateHtmlLiasse(@RequestBody DocumentRequest request) {
        try {
            // Utilisation du Builder HTML
            HtmlBuilder htmlBuilder = new HtmlBuilder();
            liasseDirector.setBuilder(htmlBuilder);
            
            if ("complete".equals(request.getLiasseType())) {
                liasseDirector.constructLiasseComplete(request.getOrderId());
            } else {
                liasseDirector.constructLiasseMinimale(request.getOrderId());
            }
            
            LiasseHTML liasse = htmlBuilder.getLiasse();
            String htmlContent = liasse.getHtmlContent();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "html", htmlContent,
                "message", "Liasse HTML générée avec succès"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @Operation(summary = "Télécharger un document généré")
    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String documentId) {
        try {
            byte[] documentContent = documentService.getDocumentContent(documentId);
            
            ByteArrayResource resource = new ByteArrayResource(documentContent);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"document_" + documentId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(documentContent.length)
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Lister les documents d'une commande")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderDocuments(@PathVariable String orderId) {
        try {
            var documents = documentService.getDocumentsByOrder(orderId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", orderId,
                "documents", documents,
                "count", documents.size()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}

// Classe de requête
class DocumentRequest {
    private String orderId;
    private String liasseType; // "complete" ou "minimale"
    
    // Getters et setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getLiasseType() { return liasseType; }
    public void setLiasseType(String liasseType) { this.liasseType = liasseType; }
}