package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("COMPTANT")
public class CommandeComptant extends Commande {
}
