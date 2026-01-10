package com.vehicules.application;

import com.vehicules.entities.LiasseDocuments;
import com.vehicules.enumerations.Format;
import com.vehicules.patterns.singleton.LiasseViergeSingleton;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VehiculesApplication {
    public static void main(String[] args) {

        SpringApplication.run(VehiculesApplication.class, args);

        LiasseViergeSingleton liassePDF = LiasseViergeSingleton.getInstance(Format.PDF);

        LiasseDocuments liasseDocumentsPDF = liassePDF.construireLiasseVierge();

        LiasseViergeSingleton liasseHTML = LiasseViergeSingleton.getInstance(Format.HTML);

        LiasseDocuments liasseDocumentsHTML = liassePDF.construireLiasseVierge();


    }
}
