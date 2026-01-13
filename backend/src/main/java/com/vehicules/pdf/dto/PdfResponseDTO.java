package com.vehicules.pdf.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class PdfResponseDTO {
    private String documentId;
    private String documentType;
    private String downloadUrl;
    private long fileSize;
    private String generatedAt;
    
    // Constructeurs
}