package com.vehicules.controllers;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.*;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.*;
import com.vehicules.services.CatalogueService;
import com.vehicules.services.VehicleDisplayService;
import com.vehicules.services.VehiculeImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

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
        System.out.println("✅ [ADMIN CONTROLLER] Test endpoint appelé");
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Admin controller fonctionnel",
            "endpoint", "/api/admin",
            "timestamp", new Date().toString(),
            "javaVersion", System.getProperty("java.version")
        ));
    }

    // ========== GESTION UTILISATEURS ==========

    @GetMapping("/utilisateurs")
    public ResponseEntity<?> getAllUtilisateurs(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false, defaultValue = "true") boolean actif) {
        
        try {
            List<Client> utilisateurs;

            if (role != null) {
                utilisateurs = clientRepository.findAll().stream()
                        .filter(u -> u.getRole() == role && isClientEnabled(u) == actif)
                        .toList();
            } else {
                utilisateurs = clientRepository.findAll().stream()
                        .filter(u -> isClientEnabled(u) == actif)
                        .toList();
            }

            return ResponseEntity.ok(utilisateurs);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération utilisateurs: " + e.getMessage()));
        }
    }

    // ========== GESTION DES VÉHICULES ==========

    @GetMapping("/vehicules")
    public ResponseEntity<?> getAllVehicules() {
        try {
            List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
            
            // Enrichir les DTO avec les images
            for (VehiculeDTO dto : vehicules) {
                if (dto.getId() != null) {
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
                        
                        // Convertir les images en format pour le frontend
                        List<Map<String, Object>> imageList = new ArrayList<>();
                        for (VehiculeImage img : images) {
                            Map<String, Object> imageMap = new HashMap<>();
                            imageMap.put("id", img.getId());
                            imageMap.put("fileName", img.getFileName());
                            imageMap.put("fileUrl", img.getFileUrl());
                            imageMap.put("thumbnailUrl", img.getThumbnailUrl());
                            imageMap.put("isMain", img.isMain());
                            imageMap.put("fileSize", img.getFileSize());
                            imageMap.put("fileType", img.getFileType());
                            imageList.add(imageMap);
                        }
                        
                        dto.setImages(imageList);
                    }
                }
            }
            
            return ResponseEntity.ok(vehicules);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération véhicules: " + e.getMessage()));
        }
    }

    @GetMapping("/vehicules/{id}")
    public ResponseEntity<?> getVehiculeById(@PathVariable Long id) {
        try {
            VehiculeDTO vehicule = catalogueService.getVehiculeById(id);
            if (vehicule == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Récupérer les images
            List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(id);
            List<Map<String, Object>> imageList = new ArrayList<>();
            
            for (VehiculeImage img : images) {
                Map<String, Object> imageMap = new HashMap<>();
                imageMap.put("id", img.getId());
                imageMap.put("fileName", img.getFileName());
                imageMap.put("fileUrl", img.getFileUrl());
                imageMap.put("thumbnailUrl", img.getThumbnailUrl());
                imageMap.put("isMain", img.isMain());
                imageMap.put("fileSize", img.getFileSize());
                imageMap.put("fileType", img.getFileType());
                imageMap.put("uploadDate", img.getUploadDate());
                imageList.add(imageMap);
            }
            
            vehicule.setImages(imageList);
            
            // Trouver l'image principale
            Optional<VehiculeImage> mainImage = images.stream()
                    .filter(VehiculeImage::isMain)
                    .findFirst();
            
            if (mainImage.isPresent()) {
                vehicule.setImageUrl(mainImage.get().getFileUrl());
                vehicule.setImageThumbnailUrl(mainImage.get().getThumbnailUrl());
            }
            
            return ResponseEntity.ok(vehicule);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération véhicule: " + e.getMessage()));
        }
    }

    @PostMapping("/vehicules")
    public ResponseEntity<?> createVehicule(@RequestBody Map<String, Object> vehiculeData) {
        try {
            System.out.println("📥 [ADMIN] Données reçues création véhicule: " + vehiculeData);
            
            Vehicule vehicule = convertMapToVehiculeEntity(vehiculeData, null);
            Vehicule saved = vehiculeRepository.save(vehicule);
            
            System.out.println("✅ [ADMIN] Véhicule créé avec ID: " + saved.getId());
            
            VehiculeDTO dto = convertToDTO(saved);
            return ResponseEntity.ok(dto);
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur création véhicule: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur création véhicule: " + e.getMessage()));
        }
    }

    @PutMapping("/vehicules/{id}")
    public ResponseEntity<?> updateVehicule(@PathVariable Long id, @RequestBody Map<String, Object> vehiculeData) {
        try {
            System.out.println("📥 [ADMIN] Données reçues modification véhicule ID " + id + ": " + vehiculeData);
            
            Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
            if (vehiculeOpt.isPresent()) {
                Vehicule existingVehicule = vehiculeOpt.get();
                Vehicule updatedVehicule = convertMapToVehiculeEntity(vehiculeData, existingVehicule);
                Vehicule saved = vehiculeRepository.save(updatedVehicule);
                
                System.out.println("✅ [ADMIN] Véhicule modifié avec succès");
                
                VehiculeDTO dto = convertToDTO(saved);
                return ResponseEntity.ok(dto);
            }
            
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur modification véhicule: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur modification véhicule: " + e.getMessage()));
        }
    }

    @DeleteMapping("/vehicules/{id}")
    public ResponseEntity<?> deleteVehicule(@PathVariable Long id) {
        try {
            if (vehiculeRepository.existsById(id)) {
                // Supprimer d'abord les images
                vehiculeImageService.deleteAllVehiculeImages(id);
                // Puis supprimer le véhicule
                vehiculeRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur suppression véhicule: " + e.getMessage()));
        }
    }

    @PutMapping("/vehicules/{id}/solde")
    public ResponseEntity<?> mettreEnSolde(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
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
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
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
            System.out.println("📷 [ADMIN] Upload image pour véhicule ID " + id);
            System.out.println("📷 Nom du fichier: " + file.getOriginalFilename());
            System.out.println("📷 Taille: " + file.getSize() + " bytes");
            System.out.println("📷 Type: " + file.getContentType());
            System.out.println("📷 Est principale: " + isMain);
            
            VehiculeImage image;
            if (isMain) {
                image = vehiculeImageService.uploadMainImage(id, file);
            } else {
                image = vehiculeImageService.uploadAdditionalImage(id, file);
            }
            
            System.out.println("✅ [ADMIN] Image uploadée avec succès: " + image.getFileUrl());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image uploadée avec succès",
                "image", Map.of(
                    "id", image.getId(),
                    "fileName", image.getFileName(),
                    "fileUrl", image.getFileUrl(),
                    "thumbnailUrl", image.getThumbnailUrl(),
                    "isMain", image.isMain(),
                    "uploadDate", image.getUploadDate()
                )
            ));
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur upload image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur lors de l'upload: " + e.getMessage()));
        }
    }

    @PostMapping("/vehicules/{id}/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) {
        
        try {
            System.out.println("📷 [ADMIN] Upload multiple images pour véhicule ID " + id);
            System.out.println("📷 Nombre de fichiers: " + files.length);
            
            List<Map<String, Object>> uploadedImages = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                try {
                    // Vérifier si c'est la première image et s'il n'y a pas déjà une image principale
                    boolean isMain = (i == 0 && vehiculeImageService.getMainImage(id) == null);
                    
                    VehiculeImage image;
                    if (isMain) {
                        image = vehiculeImageService.uploadMainImage(id, file);
                    } else {
                        image = vehiculeImageService.uploadAdditionalImage(id, file);
                    }
                    
                    uploadedImages.add(Map.of(
                        "fileName", image.getFileName(),
                        "fileUrl", image.getFileUrl(),
                        "isMain", image.isMain(),
                        "success", true
                    ));
                    
                    System.out.println("✅ [ADMIN] Image " + (i+1) + " uploadée: " + file.getOriginalFilename());
                    
                } catch (Exception e) {
                    errors.add("Fichier " + file.getOriginalFilename() + ": " + e.getMessage());
                    System.err.println("❌ [ADMIN] Erreur upload image " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalFiles", files.length);
            response.put("uploadedCount", uploadedImages.size());
            response.put("failedCount", errors.size());
            response.put("uploadedImages", uploadedImages);
            
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur upload multiple: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur lors de l'upload multiple: " + e.getMessage()));
        }
    }

    @GetMapping("/vehicules/{id}/images")
    public ResponseEntity<?> getVehiculeImages(@PathVariable Long id) {
        try {
            System.out.println("📷 [ADMIN] Récupération images pour véhicule ID " + id);
            
            List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(id);
            System.out.println("✅ [ADMIN] " + images.size() + " images récupérées");
            
            List<Map<String, Object>> imageList = new ArrayList<>();
            for (VehiculeImage image : images) {
                Map<String, Object> imageMap = new HashMap<>();
                imageMap.put("id", image.getId());
                imageMap.put("fileName", image.getFileName());
                imageMap.put("fileUrl", image.getFileUrl());
                imageMap.put("thumbnailUrl", image.getThumbnailUrl());
                imageMap.put("isMain", image.isMain());
                imageMap.put("fileSize", image.getFileSize());
                imageMap.put("fileType", image.getFileType());
                imageMap.put("uploadDate", image.getUploadDate());
                imageMap.put("uploadOrder", image.getUploadOrder());
                imageList.add(imageMap);
            }
            
            return ResponseEntity.ok(Map.of(
                "vehiculeId", id,
                "totalImages", images.size(),
                "images", imageList
            ));
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur récupération images: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération images: " + e.getMessage()));
        }
    }

    @DeleteMapping("/vehicules/images/{imageId}")
    public ResponseEntity<?> deleteVehiculeImage(@PathVariable Long imageId) {
        try {
            System.out.println("🗑️ [ADMIN] Suppression image ID " + imageId);
            
            vehiculeImageService.deleteImage(imageId);
            
            System.out.println("✅ [ADMIN] Image supprimée avec succès");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image supprimée avec succès"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur suppression image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/vehicules/images/{imageId}/set-main")
    public ResponseEntity<?> setImageAsMain(@PathVariable Long imageId) {
        try {
            System.out.println("⭐ [ADMIN] Définition image ID " + imageId + " comme principale");
            
            vehiculeImageService.setImageAsMain(imageId);
            
            System.out.println("✅ [ADMIN] Image définie comme principale");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image définie comme principale avec succès"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ [ADMIN] Erreur définition image principale: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== GESTION DES COMMANDES ==========

    @GetMapping("/commandes")
    public ResponseEntity<?> getAllCommandes(
            @RequestParam(required = false) String statut) {
        try {
            List<Commande> commandes;
            if (statut != null && !statut.isEmpty()) {
                commandes = commandeRepository.findByStatut(statut);
            } else {
                commandes = commandeRepository.findAll();
            }
            return ResponseEntity.ok(commandes);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur récupération commandes: " + e.getMessage()));
        }
    }

    @PutMapping("/commandes/{id}/statut")
    public ResponseEntity<?> updateCommandeStatut(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Optional<Commande> commandeOpt = commandeRepository.findById(id);
            if (commandeOpt.isPresent()) {
                Commande commande = commandeOpt.get();
                String statut = request.get("statut");
                if (statut != null && !statut.trim().isEmpty()) {
                    commande.setStatut(statut);
                    Commande updated = commandeRepository.save(commande);
                    return ResponseEntity.ok(updated);
                } else {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Le statut est requis"));
                }
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Erreur mise à jour statut: " + e.getMessage()));
        }
    }

    // ========== GESTION DES OPTIONS ==========

    @GetMapping("/options")
    public ResponseEntity<?> getAllOptions() {
        try {
            List<OptionVehicule> options = optionVehiculeRepository.findAll();
            return ResponseEntity.ok(options);
        } catch (Exception e) {
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
        System.out.println("🔧 [ADMIN] Conversion données Map -> Entité Vehicule");
        
        String type = getValueAsString(data, "typeVehicule", "type", "AUTOMOBILE");
        String energie = getValueAsString(data, "typeCarburant", "energie", "ESSENCE");
        
        System.out.println("📋 Type détecté: " + type + ", Energie: " + energie);
        
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
                dto.setDescriptionComplete(vehicule.getMarque() + " " + vehicule.getModele());
            }
        }

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