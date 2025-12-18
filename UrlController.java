package com.example.urlshortener.controller;

import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody Map<String, String> request) {
        try {
            String longUrl = request.get("longUrl");
            String customCode = request.get("customCode");
            String userId = request.get("userId");
            String expiryDateStr = request.get("expiryDate");
            
            LocalDateTime expiryDate = null;
            if (expiryDateStr != null && !expiryDateStr.isEmpty()) {
                expiryDate = LocalDateTime.parse(expiryDateStr);
            }

            UrlMapping mapping = urlService.shortenUrl(longUrl, customCode, userId, expiryDate);
            
             // Generate a simple QR code placeholder similar to the frontend mock
            String qrCodeBase64 = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + java.net.URLEncoder.encode(longUrl, "UTF-8");

            return ResponseEntity.ok(Map.of(
                "shortUrl", "nano.link/" + mapping.getShortCode(),
                "shortCode", mapping.getShortCode(),
                "qrCodeBase64", qrCodeBase64,
                "clicks", 0
            ));
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<List<UrlMapping>> getActivity(@RequestParam String userId) {
        return ResponseEntity.ok(urlService.getUserActivity(userId));
    }
    
    @DeleteMapping("/activity/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        urlService.deleteUrl(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/url/{code}")
    public ResponseEntity<UrlMapping> getUrlDetails(@PathVariable String code) {
        Optional<UrlMapping> mapping = urlService.getUrl(code);
        return mapping.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/click/{code}")
    public ResponseEntity<Void> trackClick(@PathVariable String code) {
        urlService.processClick(code);
        return ResponseEntity.ok().build();
    }
}

@RestController 
@RequestMapping("/")
class RedirectController {
    @Autowired
    private UrlService urlService;

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        Optional<UrlMapping> mapping = urlService.processClick(code);
        if (mapping.isPresent()) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(java.net.URI.create(mapping.get().getLongUrl()))
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .build();
        }
        
        // Redirect to welcome page or return 404
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(java.net.URI.create("/welcome"))
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .build();
    }
}
