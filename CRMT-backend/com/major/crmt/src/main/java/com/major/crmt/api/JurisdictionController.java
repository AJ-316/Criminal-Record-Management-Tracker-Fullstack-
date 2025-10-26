package com.major.crmt.api;

import com.major.crmt.entities.Jurisdiction;
import com.major.crmt.repositories.JurisdictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jurisdictions")
public class JurisdictionController {

    @Autowired
    private JurisdictionRepository jurisdictionRepository;

    @GetMapping
    public ResponseEntity<List<Jurisdiction>> getAllJurisdictions() {
        return ResponseEntity.ok(jurisdictionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Jurisdiction> createJurisdiction(@RequestBody Jurisdiction jurisdiction) {
        return ResponseEntity.ok(jurisdictionRepository.save(jurisdiction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jurisdiction> getJurisdictionById(@PathVariable Long id) {
        return jurisdictionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}