// java
package com.major.crmt.api;

import com.major.crmt.entities.Party;
import com.major.crmt.repositories.PartyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parties")
public class PartyController {
    private final PartyRepository partyRepository;
    public PartyController(PartyRepository partyRepository) { this.partyRepository = partyRepository; }

    @GetMapping
    public Page<Party> list(@RequestParam(required = false) String role,
                            @RequestParam(required = false) String query,
                            @RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "20") int size) {
        if (role != null) {
            return partyRepository.findByRoleInCase(role, PageRequest.of(page, size));
        }
        if (query != null) {
            return partyRepository.findByFullNameContainingIgnoreCase(query, PageRequest.of(page, size));
        }
        return partyRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return partyRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Party create(@RequestBody Party p) {
        return partyRepository.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Party p) {
        return partyRepository.findById(id).map(existing -> {
            existing.setFullName(p.getFullName());
            existing.setAlias(p.getAlias());
            existing.setAddress(p.getAddress());
            existing.setNationalId(p.getNationalId());
            existing.setPhotoUrl(p.getPhotoUrl());
            existing.setRoleInCase(p.getRoleInCase());
            existing.setIsPublic(p.getIsPublic());
            partyRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!partyRepository.existsById(id)) return ResponseEntity.notFound().build();
        partyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
