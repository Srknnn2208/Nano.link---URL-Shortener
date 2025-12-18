package com.example.urlshortener.repository;

import com.example.urlshortener.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<UrlMapping, String> {
    Optional<UrlMapping> findByShortCode(String shortCode);
    List<UrlMapping> findByUserId(String userId);
    boolean existsByShortCode(String shortCode);
}
