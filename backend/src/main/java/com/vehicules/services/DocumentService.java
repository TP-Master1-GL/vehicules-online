package com.vehicules.services;

import com.vehicules.entities.Document;
import com.vehicules.repositories.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public String saveDocument(String orderId, byte[] content, String format, String type) {
        Document document = new Document();
        document.setId(UUID.randomUUID().toString());
        document.setOrderId(orderId);
        document.setContenu(content);
        document.setFormat(format);
        document.setType(type);
        
        Document saved = documentRepository.save(document);
        return saved.getId();
    }

    public byte[] getDocumentContent(String documentId) {
        return documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"))
            .getContenu();
    }

    public List<Document> getDocumentsByOrder(String orderId) {
        return documentRepository.findByOrderId(orderId);
    }

    public void deleteDocument(String documentId) {
        documentRepository.deleteById(documentId);
    }
}