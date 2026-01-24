package com.vehicules.config;

import com.vehicules.patterns.abstractfactory.ElectriqueFactory;
import com.vehicules.patterns.abstractfactory.EssenceFactory;
import com.vehicules.patterns.abstractfactory.VehiculeFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class FactoryConfig {
    
    @Bean("essenceFactory")
    public VehiculeFactory essenceFactory() {
        return new EssenceFactory();
    }
    
    @Bean("electriqueFactory")
    public VehiculeFactory electriqueFactory() {
        return new ElectriqueFactory();
    }
    
    @Bean
    public Map<String, VehiculeFactory> factoryMap() {
        Map<String, VehiculeFactory> map = new HashMap<>();
        map.put("ESSENCE", essenceFactory());
        map.put("ELECTRIQUE", electriqueFactory());
        return map;
    }
}