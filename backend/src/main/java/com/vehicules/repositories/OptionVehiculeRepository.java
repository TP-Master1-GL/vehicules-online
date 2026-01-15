package com.vehicules.repositories;

import com.vehicules.core.entities.OptionVehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionVehiculeRepository extends JpaRepository<OptionVehicule, Long> {
}
