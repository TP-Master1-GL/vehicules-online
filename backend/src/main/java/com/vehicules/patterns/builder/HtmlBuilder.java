package com.vehicules.patterns.builder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class HtmlBuilder implements DocumentBuilder {
    
    private final StringBuilder htmlContent;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    public HtmlBuilder() {
        this.htmlContent = new StringBuilder();
        htmlContent.append("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Liasse Documentaire - Vente Véhicule</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .document { margin-bottom: 50px; padding: 20px; border: 1px solid #ddd; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .title { font-size: 24px; font-weight: bold; color: #2c3e50; }
                    .section { margin: 20px 0; }
                    .section-title { font-weight: bold; font-size: 18px; color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th { background-color: #3498db; color: white; padding: 10px; text-align: left; }
                    td { padding: 10px; border: 1px solid #ddd; }
                    .signature { margin-top: 50px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }
                    .page-break { page-break-after: always; }
                </style>
            </head>
            <body>
            """);
    }
    
    @Override
    public void ajouterDemandeImmatriculation(String orderId) {
        htmlContent.append("""
            <div class="document">
                <div class="header">
                    <div>RÉPUBLIQUE FRANÇAISE</div>
                    <div>MINISTÈRE DE L'INTÉRIEUR</div>
                    <div class="title">DEMANDE D'IMMATRICULATION DE VÉHICULE</div>
                </div>
                
                <div class="section">
                    <div class="section-title">1. INFORMATIONS SUR LA COMMANDE</div>
                    <table>
                        <tr><td><strong>Numéro de commande:</strong></td><td>""")
                .append(orderId)
                .append("</td></tr>")
                .append("""
                        <tr><td><strong>Date de la demande:</strong></td><td>""")
                .append(LocalDate.now().format(formatter))
                .append("</td></tr>")
                .append("""
                        <tr><td><strong>Service instructeur:</strong></td><td>Préfecture de Paris</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <div class="section-title">2. CARACTÉRISTIQUES DU VÉHICULE</div>
                    <table>
                        <tr><td><strong>Marque:</strong></td><td>TESLA</td></tr>
                        <tr><td><strong>Modèle:</strong></td><td>Model 3</td></tr>
                        <tr><td><strong>Type:</strong></td><td>Automobile électrique</td></tr>
                        <tr><td><strong>Numéro de série:</strong></td><td>5YJ3E1EAXJF123456</td></tr>
                        <tr><td><strong>Puissance (kW):</strong></td><td>239</td></tr>
                        <tr><td><strong>Cylindrée:</strong></td><td>0 cm³ (électrique)</td></tr>
                    </table>
                </div>
                
                <div class="signature">
                    <p>Fait à Paris, le """)
                .append(LocalDate.now().format(formatter))
                .append("</p>\n")
                .append("""
                    <p><strong>Signature et cachet:</strong></p>
                    <p style="border-top: 1px solid #000; width: 300px; margin-top: 50px;"></p>
                </div>
            </div>
            <div class="page-break"></div>
            """);
    }
    
    @Override
    public void ajouterCertificatCession(String orderId) {
        htmlContent.append("""
            <div class="document">
                <div class="header">
                    <div class="title">CERTIFICAT DE CESSION DE VÉHICULE</div>
                </div>
                
                <div class="section">
                    <p><strong>Je soussigné(e) :</strong></p>
                    <p style="border-bottom: 1px solid #000; width: 300px;">[NOM DU VENDEUR / CONCESSIONNAIRE]</p>
                    
                    <p><strong>déclare céder le véhicule décrit ci-dessous à :</strong></p>
                    <p style="border-bottom: 1px solid #000; width: 300px;">[NOM DE L'ACHETEUR]</p>
                </div>
                
                <div class="section">
                    <div class="section-title">DÉTAIL DU VÉHICULE CÉDÉ</div>
                    <table>
                        <tr><td><strong>Marque/Modèle:</strong></td><td>TESLA Model 3</td></tr>
                        <tr><td><strong>Type:</strong></td><td>Automobile électrique</td></tr>
                        <tr><td><strong>N° de série:</strong></td><td>5YJ3E1EAXJF123456</td></tr>
                        <tr><td><strong>Date 1ère immat.:</strong></td><td>""")
                .append(LocalDate.now().minusMonths(1).format(formatter))
                .append("</td></tr>")
                .append("""
                        <tr><td><strong>Kilométrage:</strong></td><td>50 km (neuf)</td></tr>
                        <tr><td><strong>Prix de cession:</strong></td><td>45 000 € HT</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <div class="section-title">CONDITIONS DE LA CESSION</div>
                    <ol>
                        <li>Le véhicule est vendu en l'état, sans garantie autre que légale.</li>
                        <li>La propriété est transférée à compter de la signature.</li>
                        <li>Les frais d'immatriculation sont à la charge de l'acquéreur.</li>
                    </ol>
                </div>
                
                <div class="signature">
                    <p>Fait à Paris, le """)
                .append(LocalDate.now().format(formatter))
                .append("</p>\n")
                .append("""
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                        <div>
                            <p><strong>Le Cédant</strong></p>
                            <p style="border-top: 1px solid #000; width: 200px;"></p>
                        </div>
                        <div>
                            <p><strong>L'Acquéreur</strong></p>
                            <p style="border-top: 1px solid #000; width: 200px;"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-break"></div>
            """);
    }
    
    @Override
    public void ajouterBonCommande(String orderId) {
        htmlContent.append("""
            <div class="document">
                <div class="header">
                    <div class="title">BON DE COMMANDE N° """)
                .append(orderId)
                .append("</div>\n")
                .append("""
                </div>
                
                <div class="section">
                    <p><strong>Client:</strong> [NOM DU CLIENT]</p>
                    <p><strong>Adresse:</strong> [ADRESSE DE LIVRAISON]</p>
                </div>
                
                <div class="section">
                    <div class="section-title">DÉTAIL DE LA COMMANDE</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Qté</th>
                                <th>Désignation</th>
                                <th>Prix U.</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>TESLA Model 3 - Automobile électrique<br>Couleur: Rouge<br>Batterie: Long Range</td>
                                <td>45 000 €</td>
                                <td>45 000 €</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Sièges chauffants avant et arrière</td>
                                <td>1 200 €</td>
                                <td>1 200 €</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Toit vitré panoramique</td>
                                <td>1 500 €</td>
                                <td>1 500 €</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Peinture métallisée</td>
                                <td>800 €</td>
                                <td>800 €</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Jantes 19" Sport</td>
                                <td>2 000 €</td>
                                <td>2 000 €</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>SOUS-TOTAL HT</strong></td>
                                <td>50 500 €</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>TVA (20%)</strong></td>
                                <td>10 100 €</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Livraison express (48h)</td>
                                <td>500 €</td>
                                <td>500 €</td>
                            </tr>
                            <tr style="background-color: #f0f0f0; font-weight: bold;">
                                <td colspan="3" style="text-align: right;"><strong>TOTAL TTC</strong></td>
                                <td>61 100 €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <div class="section-title">CONDITIONS DE PAIEMENT</div>
                    <ul>
                        <li>30% à la commande</li>
                        <li>70% à la livraison</li>
                    </ul>
                </div>
                
                <div class="section">
                    <div class="section-title">LIVRAISON PRÉVUE</div>
                    <p><strong>Date:</strong> """)
                .append(LocalDate.now().plusWeeks(2).format(formatter))
                .append("</p>\n")
                .append("""
                    <p><strong>Lieu:</strong> [ADRESSE DE LIVRAISON]</p>
                </div>
                
                <div class="signature">
                    <p>Pour acceptation,</p>
                    <p>Fait à Paris, le """)
                .append(LocalDate.now().format(formatter))
                .append("</p>\n")
                .append("""
                    
                    <div style="margin-top: 50px;">
                        <p><strong>Le Client</strong></p>
                        <p style="border-top: 1px solid #000; width: 300px; margin-top: 20px;"></p>
                    </div>
                    
                    <div style="margin-top: 50px;">
                        <p><strong>Cachet et signature du vendeur</strong></p>
                    </div>
                </div>
            </div>
            """);
    }
    
    @Override
    public LiasseHTML getLiasse() {
        htmlContent.append("""
                <div class="footer">
                    <hr>
                    <p>Document généré le """)
                .append(LocalDate.now().format(formatter))
                .append("""
                     - Système de vente de véhicules en ligne</p>
                </div>
            </body>
            </html>
            """);
        
        return new LiasseHTML(htmlContent.toString());
    }
}