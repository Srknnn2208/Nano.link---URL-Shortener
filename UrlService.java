package com.example.urlshortener.service;

import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    public UrlMapping shortenUrl(String longUrl, String customCode, String userId, LocalDateTime expiryDate) {
        String code = customCode;
        if (code == null || code.isEmpty()) {
            code = generateShortCode();
        } else {
            Optional<UrlMapping> existing = urlRepository.findByShortCode(code);
            if (existing.isPresent()) {
                UrlMapping existingMapping = existing.get();
                if (isExpired(existingMapping) || !existingMapping.isActive()) {
                    // Delete the expired/inactive mapping to allow reuse
                    urlRepository.delete(existingMapping);
                } else {
                    throw new RuntimeException("The link already exist");
                }
            }
        }

        UrlMapping mapping = new UrlMapping();
        mapping.setLongUrl(longUrl);
        mapping.setShortCode(code);
        mapping.setUserId(userId);
        mapping.setClicks(0);
        mapping.setExpiryDate(expiryDate != null ? expiryDate : LocalDateTime.now().plusDays(7));
        mapping.setActive(true);

        return urlRepository.save(mapping);
    }

    public Optional<UrlMapping> processClick(String shortCode) {
        Optional<UrlMapping> mappingCurrent = urlRepository.findByShortCode(shortCode);
        if (mappingCurrent.isPresent()) {
            UrlMapping mapping = mappingCurrent.get();
            
            if (isExpired(mapping) || !mapping.isActive()) {
                return Optional.empty();
            }
            
            mapping.setClicks(mapping.getClicks() + 1);
            urlRepository.save(mapping);
            return Optional.of(mapping);
        }
        return Optional.empty();
    }

    public Optional<UrlMapping> getUrl(String shortCode) {
        Optional<UrlMapping> mappingCurrent = urlRepository.findByShortCode(shortCode);
        if (mappingCurrent.isPresent()) {
            UrlMapping mapping = mappingCurrent.get();
            if (isExpired(mapping)) {
                return Optional.empty();
            }
            return Optional.of(mapping);
        }
        return Optional.empty();
    }

    public List<UrlMapping> getUserActivity(String userId) {
        return urlRepository.findByUserId(userId);
    }

    public void deleteUrl(String id) {
        urlRepository.deleteById(id);
    }

    private String generateShortCode() {
        return new Random().ints(48, 122 + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(5)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    private boolean isExpired(UrlMapping mapping) {
        if (mapping.getExpiryDate() != null && mapping.getExpiryDate().isBefore(LocalDateTime.now())) {
            System.out.println("DEBUG: Link expired. Expiry: " + mapping.getExpiryDate() + ", Now: " + LocalDateTime.now());
            mapping.setActive(false);
            urlRepository.save(mapping); // Update status
            return true;
        }
        return false;
    }
}
