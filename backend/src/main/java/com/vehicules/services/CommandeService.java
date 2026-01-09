package com.vehicules.services;

import com.vehicules.core.entities.*;
import com.vehicules.core.enums.StatutCommande;
import com.vehicules.patterns.builder.*;
import com.vehicules.patterns.factory.*;
import com.vehicules.patterns.template.CalculCommandeTemplate;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.repositories.CommandeRepository;
import com.vehicules.repositories.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private VehiculeRepository vehiculeRepository;
    
    public Commande creerCommandeComptant(Long clientId) {
        Client client = clientRepository.findById(clientId).orElseThrow();
        CommandeFactory factory = new CommandeComptantFactory();
        Commande commande = factory.creerCommande(client);
        return commandeRepository.save(commande);
    }

    public Commande creerCommandeCredit(Long clientId, double taux, int duree) {
        Client client = clientRepository.findById(clientId).orElseThrow();
        CommandeFactory factory = new CommandeCreditFactory(taux, duree);
        Commande commande = factory.creerCommande(client);
        return commandeRepository.save(commande);
    }

    public List<String> genererDocuments(Long commandeId, String format) {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow();
        
        DocumentBuilder builder;
        if ("pdf".equalsIgnoreCase(format)) {
            builder = new PdfBuilder();
        } else {
            builder = new HtmlBuilder();
        }
        
        DirecteurDocuments directeur = new DirecteurDocuments(builder);
        directeur.construireLiasseComplete(commande);
        
        return builder.getLiasse();
    }
    
    public double calculerMontantAvecTaxes(String pays, double sousTotal) {
        CalculCommandeTemplate calcul;
        
        switch (pays.toUpperCase()) {
            case "FR":
                calcul = new com.vehicules.patterns.template.CalculCommandeFR();
                break;
            case "BE":
                calcul = new com.vehicules.patterns.template.CalculCommandeBE();
                break;
            default:
                calcul = new com.vehicules.patterns.template.CalculCommandeFR(); // Par défaut
        }
        
        return calcul.calculerMontant(sousTotal);
    }
    
    public Commande validerCommande(Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow();
        commande.setStatut(StatutCommande.VALIDEE.name());
        return commandeRepository.save(commande);
    }

    public List<Commande> getCommandesParClient(Long clientId) {
        return commandeRepository.findByClientId(clientId);
    }

    public List<Commande> getCommandesParStatut(String statut) {
        return commandeRepository.findByStatut(statut);
    }
}