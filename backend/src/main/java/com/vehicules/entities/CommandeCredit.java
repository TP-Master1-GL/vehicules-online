package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CREDIT")
public class CommandeCredit extends Commande {
}
