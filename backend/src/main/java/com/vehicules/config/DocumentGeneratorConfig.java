// src/main/java/com/vehicules/config/DocumentGeneratorConfig.java
package com.vehicules.config;

import com.vehicules.patterns.adapter.DocumentGenerator;
import com.vehicules.patterns.adapter.ItextPdfAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DocumentGeneratorConfig {
    
    @Bean
    @Primary
    public DocumentGenerator documentGenerator() {
        return new ItextPdfAdapter();
    }
}