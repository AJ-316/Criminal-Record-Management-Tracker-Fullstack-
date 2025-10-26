package com.major.crmt.api;

import com.major.crmt.entities.User;
import com.major.crmt.repositories.UserRepository;
import com.major.crmt.api.dto.AuthResponse;
import com.major.crmt.api.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User u = userRepository.findByUsername(req.getUsername());
        if (u == null || !u.getPasswordHash().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        AuthResponse r = new AuthResponse();
        r.setToken("fake-jwt-token"); // replace with real JWT
        r.setUserId(u.getUserId());
        r.setUsername(u.getUsername());
        r.setFullName(u.getFullName());
        r.setRole(u.getRole());
        return ResponseEntity.ok(r);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("username taken");
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPasswordHash(req.getPassword()); // hash in real app
        u.setFullName(req.getFullName());
        // normalize role to match DB enum values (lowercase)
        String incoming = req.getRole();
        String role = "civilian"; // default
        if (incoming != null) {
            String r = incoming.trim().toLowerCase();
            if (r.equals("public")) r = "civilian";
            switch (r) {
                case "admin":
                case "police":
                case "investigator":
                case "lawyer":
                case "judge":
                case "civilian":
                    role = r;
                    break;
                default:
                    role = "civilian";
            }
        }
        u.setRole(role);
        u.setCreatedAt(Instant.now());

        System.err.println("=== DEBUG USER ===");
        System.err.println("Username: " + u.getUsername());
        System.err.println("PasswordHash: " + u.getPasswordHash());
        System.err.println("FullName: " + u.getFullName());
        System.err.println("Role: " + u.getRole());

        userRepository.save(u);
        return ResponseEntity.ok(u);
    }

}
