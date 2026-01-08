package com.vehicules.services;

import com.vehicules.entities.Vehicule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PrixServiceTest {
    
    @Autowired
    private PrixService prixService;
    
    @Test
    void testVerifierOptionsIncompatibles_OptionsCompatibles() {
        // Arrange
        var options = Arrays.asList("sièges cuir", "toit ouvrant");
        
        // Act
        boolean result = prixService.verifierOptionsIncompatibles(options);
        
        // Assert
        assertTrue(result, "Ces options devraient être compatibles");
    }
    
    @Test
    void testVerifierOptionsIncompatibles_OptionsIncompatibles() {
        // Arrange
        var options = Arrays.asList("sièges cuir", "sièges sportifs");
        
        // Act
        boolean result = prixService.verifierOptionsIncompatibles(options);
        
        // Assert
        assertFalse(result, "Ces options devraient être incompatibles");
    }
}