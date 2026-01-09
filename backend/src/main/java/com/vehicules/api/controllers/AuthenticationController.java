package com.vehicules.api.controllers;

import com.vehicules.api.dto.auth.AuthenticationResponseDTO;
import com.vehicules.api.dto.auth.LoginRequestDTO;
import com.vehicules.api.dto.auth.RegisterRequestDTO;
import com.vehicules.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        try {
            AuthenticationResponseDTO response = authenticationService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(@RequestBody LoginRequestDTO request) {
        try {
            AuthenticationResponseDTO response = authenticationService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody String refreshToken) {
        // TODO: Implémenter le refresh token
        return ResponseEntity.ok("Refresh token functionality - TODO");
    }
}
