package com.vehicules.services;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.api.mappers.VehiculeMapper;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.iterator.CatalogueIterator;
import com.vehicules.patterns.iterator.UneLigneIterator;
import com.vehicules.patterns.iterator.TroisLignesIterator;
import com.vehicules.patterns.observer.CatalogueDisplayObserver;
import com.vehicules.patterns.observer.CatalogueObservable;
import com.vehicules.patterns.observer.CatalogueObserver;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogueService implements CatalogueObservable {
    private final VehiculeRepository vehiculeRepository;
    private final VehiculeMapper vehiculeMapper;
    private final VehicleDisplayService vehicleDisplayService;
    private final List<CatalogueObserver> observers = new ArrayList<>();

    @PostConstruct
    public void init() {
        // Enregistrer l'observer d'affichage au démarrage
        addObserver(new CatalogueDisplayObserver());
    }

    @Override
    public void addObserver(CatalogueObserver observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(CatalogueObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        observers.forEach(observer -> observer.update(this));
    }

    public List<VehiculeDTO> getCatalogueUneLigne() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        CatalogueIterator iterator = new UneLigneIterator(vehicules);
        return collectVehicules(iterator);
    }

    public List<VehiculeDTO> getCatalogueTroisLignes() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        CatalogueIterator iterator = new TroisLignesIterator(vehicules);
        return collectVehicules(iterator);
    }

    public List<VehiculeDTO> getVehiculesEnSolde() {
        List<Vehicule> vehicules = vehiculeRepository.findVehiculesEnSolde();
        return vehiculeMapper.toDTOs(vehicules).stream()
                .map(this::enrichWithDisplayText)
                .toList();
    }

    public VehiculeDTO getVehiculeById(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
        VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
        return enrichWithDisplayText(dto);
    }

    public void ajouterVehicule(Vehicule vehicule) {
        vehiculeRepository.save(vehicule);
        notifyObservers();
    }

    private List<VehiculeDTO> collectVehicules(CatalogueIterator iterator) {
        List<VehiculeDTO> result = new ArrayList<>();
        while (iterator.hasNext()) {
            Vehicule vehicule = iterator.next();
            VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
            result.add(enrichWithDisplayText(dto));
        }
        return result;
    }

    private VehiculeDTO enrichWithDisplayText(VehiculeDTO dto) {
        // Ici nous aurions besoin de récupérer l'entité Vehicule complète
        // Pour l'instant, nous simulons avec une logique basique
        dto.setDescriptionComplete(generateBasicDisplayText(dto));
        return dto;
    }

    private String generateBasicDisplayText(VehiculeDTO dto) {
        StringBuilder sb = new StringBuilder();
        sb.append(dto.getMarque()).append(" ").append(dto.getModele());
        sb.append(" - ").append(dto.getType()).append(" ").append(dto.getEnergie());

        if (dto.getEnSolde()) {
            sb.append(" ⭐ EN PROMOTION");
        }

        sb.append(" - ").append(dto.getPrixFinal()).append("€");

        return sb.toString();
    }
}
