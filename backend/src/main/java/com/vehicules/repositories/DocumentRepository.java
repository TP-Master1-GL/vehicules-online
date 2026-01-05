package com.vehicules.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.vehicules.entities.Document;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByOrderId(String orderId);
}