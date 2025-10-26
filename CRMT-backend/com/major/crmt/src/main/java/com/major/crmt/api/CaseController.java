// java
package com.major.crmt.api;

import com.major.crmt.api.dto.CaseDetailsDto;
import com.major.crmt.api.dto.CreateCaseDto;
import com.major.crmt.entities.CaseEntity;
import com.major.crmt.repositories.CaseRepository;
import com.major.crmt.services.CaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cases")
public class CaseController {
    private final CaseRepository caseRepository;
    private final CaseService caseService;

    public CaseController(CaseRepository caseRepository, CaseService caseService) {
        this.caseRepository = caseRepository;
        this.caseService = caseService;
    }

    @GetMapping
    public Page<CaseDetailsDto> list(@RequestParam(required = false) Long jurisdictionId,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size) {
        return caseService.listCases(jurisdictionId, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseDetailsDto> get(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(caseService.getCaseDetails(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateCaseDto dto, @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) userId = 1L; // fallback
        CaseEntity created = caseService.createCase(dto, userId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CaseEntity updated) {
        return caseRepository.findById(id).map(existing -> {
            existing.setDescription(updated.getDescription());
            existing.setJurisdictionId(updated.getJurisdictionId());
            existing.setFirId(updated.getFirId());
            existing.setRegistrationDate(updated.getRegistrationDate());
            caseRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!caseRepository.existsById(id)) return ResponseEntity.notFound().build();
        caseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
