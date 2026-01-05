package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SCOOTER_ESSENCE")
public class ScooterEssence extends Scooter {
}
