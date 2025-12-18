package com.example.urlshortener.controller;

import com.example.urlshortener.model.User;
import com.example.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // Note: Storing plain text password as per current simplicity requirement
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
              return ResponseEntity.badRequest().body(Map.of("message", "Username and password required"));
        }

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            // Specific error as requested
            return ResponseEntity.status(404).body(Map.of(
                "message", "Wrong Username", 
                "errorType", "USER_NOT_FOUND",
                "suggestion", "Please register first"
            ));
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            // Specific error as requested
            return ResponseEntity.status(401).body(Map.of(
                "message", "Wrong Password", 
                "errorType", "WRONG_PASSWORD"
            ));
        }

        return ResponseEntity.ok(user);
    }
}
