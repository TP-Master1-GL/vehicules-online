package com.vehicules.pdf.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class PdfRequestDTO {
    private Long commandeId;
    private String documentType;
    private boolean includeWatermark;
    private String language;

}