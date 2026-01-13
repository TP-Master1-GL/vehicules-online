package com.vehicules.patterns.bridge;

import java.util.Map;

// Implémentation Widget (simulée pour composants modernes)
public class WidgetFormImplementation implements FormulaireImplementation {
    private StringBuilder widget = new StringBuilder();
    
    @Override
    public void dessinerChampTexte(String label, String name, String valeur) {
        widget.append("TextField(\n");
        widget.append("  label: \"").append(label).append("\",\n");
        widget.append("  name: \"").append(name).append("\",\n");
        widget.append("  value: \"").append(valeur != null ? valeur : "").append("\",\n");
        widget.append("  controller: TextEditingController(),\n");
        widget.append(")\n");
    }
    
    @Override
    public void dessinerChampEmail(String label, String name, String valeur) {
        widget.append("EmailField(\n");
        widget.append("  label: \"").append(label).append("\",\n");
        widget.append("  name: \"").append(name).append("\",\n");
        widget.append("  value: \"").append(valeur != null ? valeur : "").append("\",\n");
        widget.append("  keyboardType: TextInputType.emailAddress,\n");
        widget.append(")\n");
    }
    
    @Override
    public void dessinerChampSelect(String label, String name, Map<String, String> options) {
        widget.append("DropdownButtonFormField(\n");
        widget.append("  label: \"").append(label).append("\",\n");
        widget.append("  items: [\n");
        
        for (Map.Entry<String, String> option : options.entrySet()) {
            widget.append("    DropdownMenuItem(\n");
            widget.append("      value: \"").append(option.getKey()).append("\",\n");
            widget.append("      child: Text(\"").append(option.getValue()).append("\"),\n");
            widget.append("    ),\n");
        }
        
        widget.append("  ],\n");
        widget.append("  onChanged: (value) {},\n");
        widget.append(")\n");
    }
    
    @Override
    public void dessinerBouton(String texte, String type) {
        widget.append("ElevatedButton(\n");
        widget.append("  onPressed: () {},\n");
        widget.append("  child: Text(\"").append(texte).append("\"),\n");
        widget.append(")\n");
    }
    
    @Override
    public String getRenduComplet() {
        return "import 'package:flutter/material.dart';\n\n" +
               "class GeneratedForm extends StatelessWidget {\n" +
               "  @override\n" +
               "  Widget build(BuildContext context) {\n" +
               "    return Column(\n" +
               "      children: [\n" + widget.toString() + "\n      ],\n" +
               "    );\n" +
               "  }\n" +
               "}";
    }
    
    @Override
    public void reset() {
        widget = new StringBuilder();
    }
}