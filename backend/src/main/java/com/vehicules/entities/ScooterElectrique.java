package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SCOOTER_ELECTRIQUE")
public class ScooterElectrique extends Scooter {
}
