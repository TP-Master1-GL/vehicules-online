package com.vehicules.controllers;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.api.dto.VehiculeImageDTO;
import com.vehicules.core.entities.*;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.*;
import com.vehicules.services.CatalogueService;
import com.vehicules.services.VehicleDisplayService;
import com.vehicules.services.VehiculeImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private OptionVehiculeRepository optionVehiculeRepository;

    @Autowired
    private CatalogueService catalogueService;
    
    @Autowired
    private VehicleDisplayService vehicleDisplayService;
    
    @Autowired
    private VehiculeImageService vehiculeImageService;

    // ========== ENDPOINTS DE TEST ==========
    
    @GetMapping("/test")
    public ResponseEntity<?> testAdminEndpoint() {
        log.info("✅ [ADMIN CONTROLLER] Test endpoint appelé");
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Admin controller fonctionnel",
            "endpoint", "/api/admin",
            "timestamp", new Date().toString(),
            "javaVersion", System.getProperty("java.version")
        ));
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Authentification admin réussie",
            "role", "ADMIN",
            "timestamp", LocalDateTime.now().toString()
        ));
    }

    // ========== GESTION UTILISATEURS ==========

    @GetMapping("/utilisateurs")
    public ResponseEntity<?> getAllUtilisateurs(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false, defaultValue = "true") boolean actif) {
        
        try {
            log.info("👥 [ADMIN] Récupération utilisateurs - Role: {}, Actif: {}", role, actif);
            
            List<Client> utilisateurs = clientRepository.findAll();

            List<Client> filtered;
            if (role != null) {
                filtered = utilisateurs.stream()
                        .filter(u -> u.getRole() == role && isClientEnabled(u) == actif)
                        .collect(Collectors.toList());
            } else {
                filtered = utilisateurs.stream()
                        .filter(u -> isClientEnabled(u) == actif)
                        .collect(Collectors.toList());
            }

            log.info("✅ [ADMIN] {} utilisateurs récupérés", filtered.size());
            return ResponseEntity.ok(filtered);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération utilisateurs: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération utilisateurs: " + e.getMessage()));
        }
    }

    // ========== GESTION DES VÉHICULES ==========

    @GetMapping("/vehicules")
    public ResponseEntity<?> getAllVehicules() {
        try {
            log.info("🚗 [ADMIN] Récupération de tous les véhicules");
            
            List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
            
            // Enrichir les DTO avec les images
            for (VehiculeDTO dto : vehicules) {
                if (dto.getId() != null) {
                    try {
                        List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(dto.getId());
                        if (!images.isEmpty()) {
                            // Trouver l'image principale
                            Optional<VehiculeImage> mainImage = images.stream()
                                    .filter(VehiculeImage::isMain)
                                    .findFirst();
                            
                            if (mainImage.isPresent()) {
                                dto.setImageUrl(mainImage.get().getFileUrl());
                                dto.setImageThumbnailUrl(mainImage.get().getThumbnailUrl());
                            }
                            
                            // Convertir les images en DTOs
                            List<VehiculeImageDTO> imageDTOs = convertImageEntitiesToDTOs(images);
                            dto.setImages(imageDTOs);
                        }
                    } catch (Exception e) {
                        log.warn("⚠️ [ADMIN] Erreur récupération images véhicule {}: {}", dto.getId(), e.getMessage());
                    }
                }
            }
            
            log.info("✅ [ADMIN] {} véhicules récupérés", vehicules.size());
            return ResponseEntity.ok(vehicules);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération véhicules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération véhicules: " + e.getMessage()));
        }
    }

    @GetMapping("/vehicules/{id}")
    public ResponseEntity<?> getVehiculeById(@PathVariable Long id) {
        try {
            log.info("🔍 [ADMIN] Récupération véhicule ID: {}", id);
            
            VehiculeDTO vehicule = catalogueService.getVehiculeById(id);
            if (vehicule == null) {
                log.warn("⚠️ [ADMIN] Véhicule non trouvé ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            
            // Récupérer les images
            List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(id);
            List<VehiculeImageDTO> imageDTOs = convertImageEntitiesToDTOs(images);
            vehicule.setImages(imageDTOs);
            
            // Trouver l'image principale
            Optional<VehiculeImage> mainImage = images.stream()
                    .filter(VehiculeImage::isMain)
                    .findFirst();
            
            if (mainImage.isPresent()) {
                vehicule.setImageUrl(mainImage.get().getFileUrl());
                vehicule.setImageThumbnailUrl(mainImage.get().getThumbnailUrl());
            }
            
            log.info("✅ [ADMIN] Véhicule ID {} récupéré avec {} images", id, images.size());
            return ResponseEntity.ok(vehicule);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération véhicule: " + e.getMessage()));
        }
    }

    @PostMapping("/vehicules")
    public ResponseEntity<?> createVehicule(@RequestBody Map<String, Object> vehiculeData) {
        try {
            log.info("📥 [ADMIN] Données reçues création véhicule: {}", vehiculeData);
            
            Vehicule vehicule = convertMapToVehiculeEntity(vehiculeData, null);
            Vehicule saved = vehiculeRepository.save(vehicule);
            
            log.info("✅ [ADMIN] Véhicule créé avec ID: {}", saved.getId());
            
            VehiculeDTO dto = convertToDTO(saved);
            return ResponseEntity.ok(dto);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur création véhicule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur création véhicule: " + e.getMessage()));
        }
    }

    @PutMapping("/vehicules/{id}")
    public ResponseEntity<?> updateVehicule(@PathVariable Long id, @RequestBody Map<String, Object> vehiculeData) {
        try {
            log.info("📥 [ADMIN] Données reçues modification véhicule ID {}: {}", id, vehiculeData);
            
            Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
            if (vehiculeOpt.isPresent()) {
                Vehicule existingVehicule = vehiculeOpt.get();
                Vehicule updatedVehicule = convertMapToVehiculeEntity(vehiculeData, existingVehicule);
                Vehicule saved = vehiculeRepository.save(updatedVehicule);
                
                log.info("✅ [ADMIN] Véhicule ID {} modifié avec succès", id);
                
                VehiculeDTO dto = convertToDTO(saved);
                return ResponseEntity.ok(dto);
            }
            
            log.warn("⚠️ [ADMIN] Véhicule non trouvé ID: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur modification véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur modification véhicule: " + e.getMessage()));
        }
    }

    @DeleteMapping("/vehicules/{id}")
    public ResponseEntity<?> deleteVehicule(@PathVariable Long id) {
        try {
            log.info("🗑️ [ADMIN] Suppression véhicule ID: {}", id);
            
            if (vehiculeRepository.existsById(id)) {
                // Supprimer d'abord les images
                vehiculeImageService.deleteAllVehiculeImages(id);
                // Puis supprimer le véhicule
                vehiculeRepository.deleteById(id);
                
                log.info("✅ [ADMIN] Véhicule ID {} supprimé", id);
                return ResponseEntity.ok().build();
            }
            
            log.warn("⚠️ [ADMIN] Véhicule non trouvé ID: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur suppression véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur suppression véhicule: " + e.getMessage()));
        }
    }

    @PutMapping("/vehicules/{id}/solde")
    public ResponseEntity<?> mettreEnSolde(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            log.info("🏷️ [ADMIN] Mise en solde véhicule ID: {}", id);
            
            Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
            if (vehiculeOpt.isPresent()) {
                Vehicule vehicule = vehiculeOpt.get();
                vehicule.setEnSolde(true);
                
                if (request.containsKey("pourcentageSolde")) {
                    Object pourcObj = request.get("pourcentageSolde");
                    BigDecimal pourcentage;
                    if (pourcObj instanceof Number) {
                        pourcentage = BigDecimal.valueOf(((Number) pourcObj).doubleValue());
                    } else if (pourcObj instanceof String) {
                        try {
                            pourcentage = new BigDecimal((String) pourcObj);
                        } catch (Exception e) {
                            pourcentage = BigDecimal.valueOf(10.0);
                        }
                    } else {
                        pourcentage = BigDecimal.valueOf(10.0);
                    }
                    vehicule.setPourcentageSolde(pourcentage);
                }
                
                Vehicule updated = vehiculeRepository.save(vehicule);
                VehiculeDTO dto = convertToDTO(updated);
                
                log.info("✅ [ADMIN] Véhicule ID {} mis en solde", id);
                return ResponseEntity.ok(dto);
            }
            
            log.warn("⚠️ [ADMIN] Véhicule non trouvé ID: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur mise en solde véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur mise en solde: " + e.getMessage()));
        }
    }

    // ========== GESTION DES IMAGES ==========

    @PostMapping("/vehicules/{id}/upload-image")
    public ResponseEntity<?> uploadVehiculeImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isMain", defaultValue = "false") boolean isMain) {
        
        try {
            log.info("📷 [ADMIN] Upload image pour véhicule ID {} - Fichier: {}, Taille: {}", 
                     id, file.getOriginalFilename(), file.getSize());
            
            // VÉRIFICATION: S'assurer que le fichier n'est pas null
            if (file == null || file.isEmpty()) {
                log.error("❌ [ADMIN] Fichier manquant ou vide");
                return ResponseEntity.badRequest()
                        .body(Map.of(
                            "success", false,
                            "message", "Le fichier est requis",
                            "error", "FILE_EMPTY"
                        ));
            }
            
            log.debug("📷 DEBUG - Nom du fichier: {}", file.getOriginalFilename());
            log.debug("📷 DEBUG - Taille: {} bytes", file.getSize());
            log.debug("📷 DEBUG - Content-Type: {}", file.getContentType());
            log.debug("📷 DEBUG - isMain: {}", isMain);
            
            VehiculeImage image;
            if (isMain) {
                image = vehiculeImageService.uploadMainImage(id, file);
            } else {
                image = vehiculeImageService.uploadAdditionalImage(id, file);
            }
            
            log.info("✅ [ADMIN] Image uploadée avec succès pour véhicule {}: {}", id, image.getFileName());
            
            // Convertir l'image en DTO
            VehiculeImageDTO imageDTO = convertVehiculeImageToDTO(image);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image uploadée avec succès",
                "image", imageDTO
            ));
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur upload image pour véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "Erreur lors de l'upload: " + e.getMessage(),
                        "error", "UPLOAD_ERROR"
                    ));
        }
    }

    @PostMapping("/test-upload")
    public ResponseEntity<?> testUpload(@RequestParam("file") MultipartFile file) {
        try {
            log.info("🧪 [TEST] Upload test - Fichier: {}, Taille: {}, Type: {}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Fichier vide"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test d'upload réussi",
                "fileName", file.getOriginalFilename(),
                "fileSize", file.getSize(),
                "contentType", file.getContentType()
            ));
            
        } catch (Exception e) {
            log.error("❌ [TEST] Erreur test upload: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/vehicules/{id}/images")
    public ResponseEntity<?> getVehiculeImages(@PathVariable Long id) {
        try {
            log.info("📷 [ADMIN] Récupération images pour véhicule ID: {}", id);
            
            List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(id);
            log.info("✅ [ADMIN] {} images récupérées pour véhicule ID: {}", images.size(), id);
            
            List<VehiculeImageDTO> imageDTOs = convertImageEntitiesToDTOs(images);
            
            return ResponseEntity.ok(Map.of(
                "vehiculeId", id,
                "totalImages", images.size(),
                "images", imageDTOs
            ));
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération images véhicule {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération images: " + e.getMessage()));
        }
    }

    @DeleteMapping("/vehicules/images/{imageId}")
    public ResponseEntity<?> deleteVehiculeImage(@PathVariable Long imageId) {
        try {
            log.info("🗑️ [ADMIN] Suppression image ID: {}", imageId);
            
            vehiculeImageService.deleteImage(imageId);
            
            log.info("✅ [ADMIN] Image ID {} supprimée", imageId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image supprimée avec succès"
            ));
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur suppression image {}: {}", imageId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/vehicules/images/{imageId}/set-main")
    public ResponseEntity<?> setImageAsMain(@PathVariable Long imageId) {
        try {
            log.info("⭐ [ADMIN] Définition image ID {} comme principale", imageId);
            
            vehiculeImageService.setImageAsMain(imageId);
            
            log.info("✅ [ADMIN] Image ID {} définie comme principale", imageId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image définie comme principale avec succès"
            ));
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur définition image principale {}: {}", imageId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== GESTION DES COMMANDES ==========

    @GetMapping("/commandes")
    public ResponseEntity<?> getAllCommandes(
            @RequestParam(required = false) String statut) {
        try {
            log.info("📦 [ADMIN] Récupération commandes - Statut: {}", statut != null ? statut : "tous");
            
            List<Commande> commandes;
            if (statut != null && !statut.isEmpty()) {
                commandes = commandeRepository.findByStatut(statut);
            } else {
                commandes = commandeRepository.findAll();
            }
            
            log.info("✅ [ADMIN] {} commandes récupérées", commandes.size());
            return ResponseEntity.ok(commandes);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération commandes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération commandes: " + e.getMessage()));
        }
    }

    @PutMapping("/commandes/{id}/statut")
    public ResponseEntity<?> updateCommandeStatut(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            log.info("📦 [ADMIN] Mise à jour statut commande ID: {}", id);
            
            Optional<Commande> commandeOpt = commandeRepository.findById(id);
            if (commandeOpt.isPresent()) {
                Commande commande = commandeOpt.get();
                String statut = request.get("statut");
                if (statut != null && !statut.trim().isEmpty()) {
                    commande.setStatut(statut);
                    Commande updated = commandeRepository.save(commande);
                    
                    log.info("✅ [ADMIN] Statut commande ID {} mis à jour: {}", id, statut);
                    return ResponseEntity.ok(updated);
                } else {
                    log.warn("⚠️ [ADMIN] Statut vide pour commande ID: {}", id);
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Le statut est requis"));
                }
            }
            
            log.warn("⚠️ [ADMIN] Commande non trouvée ID: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur mise à jour statut commande {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur mise à jour statut: " + e.getMessage()));
        }
    }

    // ========== GESTION DES OPTIONS ==========

    @GetMapping("/options")
    public ResponseEntity<?> getAllOptions() {
        try {
            log.info("⚙️ [ADMIN] Récupération toutes les options");
            
            List<OptionVehicule> options = optionVehiculeRepository.findAll();
            
            log.info("✅ [ADMIN] {} options récupérées", options.size());
            return ResponseEntity.ok(options);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN] Erreur récupération options: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération options: " + e.getMessage()));
        }
    }

    // ========== MÉTHODES UTILITAIRES ==========

    private boolean isClientEnabled(Client client) {
        if (client instanceof ClientParticulier) {
            ClientParticulier cp = (ClientParticulier) client;
            return cp.getEnabled() != null ? cp.getEnabled() : true;
        }
        return true;
    }

    private Vehicule convertMapToVehiculeEntity(Map<String, Object> data, Vehicule existingVehicule) {
        log.info("🔧 [ADMIN] Conversion données Map -> Entité Vehicule");
        
        String type = getValueAsString(data, "typeVehicule", "type", "AUTOMOBILE");
        String energie = getValueAsString(data, "typeCarburant", "energie", "ESSENCE");
        
        log.debug("📋 Type détecté: {}, Energie: {}", type, energie);
        
        Vehicule vehicule;
        
        if (existingVehicule != null) {
            vehicule = existingVehicule;
        } else {
            vehicule = createNewVehiculeInstance(type, energie);
        }
        
        updateCommonProperties(vehicule, data);
        updateSpecificProperties(vehicule, data, type, energie);
        
        return vehicule;
    }
    
    private Vehicule createNewVehiculeInstance(String type, String energie) {
        if ("AUTOMOBILE".equalsIgnoreCase(type)) {
            if ("ELECTRIQUE".equalsIgnoreCase(energie)) {
                return new AutomobileElectrique();
            } else {
                return new AutomobileEssence();
            }
        } else { // SCOOTER
            if ("ELECTRIQUE".equalsIgnoreCase(energie)) {
                return new ScooterElectrique();
            } else {
                return new ScooterEssence();
            }
        }
    }
    
    private void updateCommonProperties(Vehicule vehicule, Map<String, Object> data) {
        if (data.containsKey("marque")) {
            vehicule.setMarque(getValueAsString(data, "marque", ""));
        }
        if (data.containsKey("modele")) {
            vehicule.setModele(getValueAsString(data, "modele", ""));
        }
        
        if (data.containsKey("prix") || data.containsKey("prixBase")) {
            BigDecimal prix = getValueAsBigDecimal(data, "prix", "prixBase", BigDecimal.valueOf(15000000));
            vehicule.setPrixBase(prix);
        }
        
        if (data.containsKey("dateStock")) {
            String dateStr = getValueAsString(data, "dateStock", "");
            if (!dateStr.isEmpty()) {
                try {
                    vehicule.setDateStock(LocalDate.parse(dateStr));
                } catch (Exception e) {
                    log.warn("⚠️ [ADMIN] Erreur parsing dateStock, utilisation date actuelle");
                    vehicule.setDateStock(LocalDate.now());
                }
            }
        } else if (vehicule.getDateStock() == null) {
            vehicule.setDateStock(LocalDate.now());
        }
        
        if (data.containsKey("enSolde")) {
            boolean enSolde = getValueAsBoolean(data, "enSolde", false);
            vehicule.setEnSolde(enSolde);
        }
        
        if (vehicule.getEnSolde() && data.containsKey("pourcentageSolde")) {
            BigDecimal pourcentage = getValueAsBigDecimal(data, "pourcentageSolde", BigDecimal.valueOf(10.0));
            vehicule.setPourcentageSolde(pourcentage);
        }
    }
    
    private void updateSpecificProperties(Vehicule vehicule, Map<String, Object> data, String type, String energie) {
        if ("AUTOMOBILE".equalsIgnoreCase(type)) {
            Automobile auto = (Automobile) vehicule;
            
            auto.setNombrePortes(getValueAsInteger(data, "nombrePortes", 4));
            auto.setNombrePlaces(getValueAsInteger(data, "nombrePlaces", 5));
            auto.setCouleur(getValueAsString(data, "couleur", "#000000"));
            auto.setPuissance(getValueAsInteger(data, "puissance", 100));
            auto.setTransmission(getValueAsString(data, "transmission", "MANUELLE"));
            
            if ("ESSENCE".equalsIgnoreCase(energie)) {
                AutomobileEssence essence = (AutomobileEssence) auto;
                essence.setConsommation(getValueAsBigDecimal(data, "consommation", BigDecimal.valueOf(6.5)));
                essence.setCarburant(getValueAsString(data, "carburant", "ESSENCE"));
                essence.setAutonomie(getValueAsInteger(data, "autonomie", 600));
            } else if ("ELECTRIQUE".equalsIgnoreCase(energie)) {
                AutomobileElectrique electrique = (AutomobileElectrique) auto;
                electrique.setAutonomie(getValueAsInteger(data, "autonomie", 300));
                electrique.setTempsChargeRapide(getValueAsInteger(data, "tempsChargeRapide", 30));
                electrique.setTypeChargeur(getValueAsString(data, "typeChargeur", "TYPE2"));
            }
            
        } else if ("SCOOTER".equalsIgnoreCase(type)) {
            Scooter scooter = (Scooter) vehicule;
            
            scooter.setCouleur(getValueAsString(data, "couleur", "#000000"));
            scooter.setCylindree(getValueAsInteger(data, "cylindree", 125));
            scooter.setCategoriePermis(getValueAsString(data, "categoriePermis", "A1"));
            
            if ("ESSENCE".equalsIgnoreCase(energie)) {
                ScooterEssence essence = (ScooterEssence) scooter;
                essence.setConsommation(getValueAsBigDecimal(data, "consommation", BigDecimal.valueOf(2.5)));
                essence.setCarburant(getValueAsString(data, "carburant", "ESSENCE"));
                essence.setAutonomie(getValueAsInteger(data, "autonomie", 250));
            } else if ("ELECTRIQUE".equalsIgnoreCase(energie)) {
                ScooterElectrique electrique = (ScooterElectrique) scooter;
                electrique.setAutonomie(getValueAsInteger(data, "autonomie", 100));
                electrique.setTempsCharge(getValueAsInteger(data, "tempsCharge", 180));
                electrique.setTypeBatterie(getValueAsString(data, "typeBatterie", "LITHIUM_ION"));
            }
        }
    }
    
    private VehiculeDTO convertToDTO(Vehicule vehicule) {
        if (vehicule == null) return null;

        VehiculeDTO dto = new VehiculeDTO();
        dto.setId(vehicule.getId());
        dto.setMarque(vehicule.getMarque());
        dto.setModele(vehicule.getModele());
        dto.setPrixBase(vehicule.getPrixBase());
        dto.setPrixFinal(vehicule.getPrixFinal());
        dto.setDateStock(vehicule.getDateStock());
        dto.setEnSolde(vehicule.getEnSolde());
        dto.setPourcentageSolde(vehicule.getPourcentageSolde());
        dto.setType(vehicule.getType());
        dto.setEnergie(vehicule.getEnergie());
        
        // Images
        dto.setImageUrl(vehicule.getImageUrl());
        dto.setImageThumbnailUrl(vehicule.getImageThumbnailUrl());
        dto.setAdditionalImages(vehicule.getAdditionalImages());

        if (vehicleDisplayService != null) {
            try {
                String displayText = vehicleDisplayService.afficherAvecDecorations(vehicule);
                dto.setDescriptionComplete(displayText);
            } catch (Exception e) {
                log.warn("⚠️ [ADMIN] Erreur génération description décorée: {}", e.getMessage());
                dto.setDescriptionComplete(vehicule.getMarque() + " " + vehicule.getModele());
            }
        }

        return dto;
    }
    
    // ========== MÉTHODES DE CONVERSION D'IMAGES ==========
    
    private List<VehiculeImageDTO> convertImageEntitiesToDTOs(List<VehiculeImage> images) {
        List<VehiculeImageDTO> dtos = new ArrayList<>();
        for (VehiculeImage img : images) {
            dtos.add(convertVehiculeImageToDTO(img));
        }
        return dtos;
    }
    
    private VehiculeImageDTO convertVehiculeImageToDTO(VehiculeImage image) {
        if (image == null) return null;
        
        VehiculeImageDTO dto = new VehiculeImageDTO();
        dto.setId(image.getId());
        dto.setFileName(image.getFileName());
        dto.setFileUrl(image.getFileUrl());
        dto.setThumbnailUrl(image.getThumbnailUrl());
        dto.setMain(image.isMain());
        dto.setFileSize(image.getFileSize());
        dto.setFileType(image.getFileType());
        dto.setUploadDate(image.getUploadDate());
        dto.setUploadOrder(image.getUploadOrder());
        return dto;
    }
    
    // ========== MÉTHODES UTILITAIRES DE CONVERSION ==========
    
    private String getValueAsString(Map<String, Object> data, String key, String defaultValue) {
        if (data.containsKey(key) && data.get(key) != null) {
            return data.get(key).toString();
        }
        return defaultValue;
    }
    
    private String getValueAsString(Map<String, Object> data, String key1, String key2, String defaultValue) {
        if (data.containsKey(key1) && data.get(key1) != null) {
            return data.get(key1).toString();
        }
        if (data.containsKey(key2) && data.get(key2) != null) {
            return data.get(key2).toString();
        }
        return defaultValue;
    }
    
    private Integer getValueAsInteger(Map<String, Object> data, String key, Integer defaultValue) {
        if (data.containsKey(key) && data.get(key) != null) {
            Object value = data.get(key);
            if (value instanceof Number) {
                return ((Number) value).intValue();
            } else if (value instanceof String) {
                try {
                    return Integer.parseInt((String) value);
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }
    
    private BigDecimal getValueAsBigDecimal(Map<String, Object> data, String key, BigDecimal defaultValue) {
        if (data.containsKey(key) && data.get(key) != null) {
            Object value = data.get(key);
            if (value instanceof Number) {
                return BigDecimal.valueOf(((Number) value).doubleValue());
            } else if (value instanceof String) {
                try {
                    return new BigDecimal((String) value);
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }
    
    private BigDecimal getValueAsBigDecimal(Map<String, Object> data, String key1, String key2, BigDecimal defaultValue) {
        if (data.containsKey(key1) && data.get(key1) != null) {
            Object value = data.get(key1);
            return convertObjectToBigDecimal(value, defaultValue);
        }
        if (data.containsKey(key2) && data.get(key2) != null) {
            Object value = data.get(key2);
            return convertObjectToBigDecimal(value, defaultValue);
        }
        return defaultValue;
    }
    
    private BigDecimal convertObjectToBigDecimal(Object value, BigDecimal defaultValue) {
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        } else if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }
    
    private Boolean getValueAsBoolean(Map<String, Object> data, String key, Boolean defaultValue) {
        if (data.containsKey(key) && data.get(key) != null) {
            Object value = data.get(key);
            if (value instanceof Boolean) {
                return (Boolean) value;
            } else if (value instanceof String) {
                return Boolean.parseBoolean((String) value);
            } else if (value instanceof Number) {
                return ((Number) value).intValue() != 0;
            }
        }
        return defaultValue;
    }
}