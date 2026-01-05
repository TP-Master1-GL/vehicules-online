package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("AUTOMOBILE_ESSENCE")
public class AutomobileEssence extends Automobile {
}
