package com.example.urlshortener.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String shortCode;

    @Column(nullable = false, length = 2048)
    private String longUrl;

    private String userId;

    private long clicks;

    private LocalDateTime expiryDate;

    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
}
