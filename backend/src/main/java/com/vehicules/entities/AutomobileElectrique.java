package com.vehicules.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("AUTOMOBILE_ELECTRIQUE")
public class AutomobileElectrique extends Automobile {
}
