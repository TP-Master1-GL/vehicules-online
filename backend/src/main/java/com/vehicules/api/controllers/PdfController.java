package com.vehicules.api.controllers;

import com.vehicules.core.entities.Commande;
import com.vehicules.pdf.dto.PdfRequestDTO;
import com.vehicules.pdf.dto.PdfResponseDTO;
import com.vehicules.pdf.services.DocumentService;
import com.vehicules.repositories.CommandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pdf")
@CrossOrigin(origins = "*")

@RequiredArgsConstructor

public class PdfController {
    

    private DocumentService documentService;
    

    private CommandeRepository commandeRepository;
    
    @PostMapping("/generate")
    public ResponseEntity<PdfResponseDTO> generatePdf(@RequestBody PdfRequestDTO request) {
        try {
            Commande commande = commandeRepository.findById(request.getCommandeId())
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            byte[] pdfContent = documentService.generateDocumentByType(commande, request.getDocumentType());
            
            PdfResponseDTO response = new PdfResponseDTO(
                UUID.randomUUID().toString(),
                request.getDocumentType(),
                "/api/pdf/download/" + request.getCommandeId() + "/" + request.getDocumentType(),
                pdfContent.length
            );
            
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
                PdfResponseDTO response = new PdfResponseDTO(
                    UUID.randomUUID().toString(),
                    documentTypes[i],
                    "/api/pdf/download/" + commandeId + "/" + documentTypes[i],
                    documents.get(i).length
                );
                responses.add(response);
            }
            
            return ResponseEntity.ok(responses);
            
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération de la liasse", e);
        }
    }
    
    @GetMapping("/preview/{commandeId}/{documentType}")
    public ResponseEntity<String> previewHtml(
            @PathVariable Long commandeId,
            @PathVariable String documentType) {

        try {
            Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
            
            // Utiliser l'adapteur pour générer HTML
            com.vehicules.patterns.adapter.DocumentGenerator generator = 
                new com.vehicules.patterns.adapter.ItextPdfAdapter();
            
            String title = getDocumentTitle(documentType);
            String content = getDocumentContent(commande, documentType);
            
            String html = generator.generateHtml(title, content);
            
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de l'aperçu HTML", e);
        }
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
        // Construire le contenu basique
        return "Document: " + documentType + "\n" +
               "Commande N°: " + commande.getId() + "\n" +
               "Client: " + commande.getClient().getNom() + "\n" +
               "Date: " + new java.text.SimpleDateFormat("dd/MM/yyyy").format(new java.util.Date());
    }
}