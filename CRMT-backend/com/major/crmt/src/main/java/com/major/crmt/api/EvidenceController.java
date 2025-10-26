// java
package com.major.crmt.api;

import com.major.crmt.entities.Evidence;
import com.major.crmt.repositories.EvidenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/cases/{caseId}/evidence")
public class EvidenceController {
    private final EvidenceRepository evidenceRepository;
    private final Path storageRoot = Paths.get("evidence-storage"); // adjust

    public EvidenceController(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
        try { Files.createDirectories(storageRoot); } catch (Exception ignored) {}
    }

    @GetMapping
    public List<Evidence> list(@PathVariable Long caseId) {
        return evidenceRepository.findByCaseId(caseId);
    }

    @PostMapping
    public ResponseEntity<?> upload(@PathVariable Long caseId,
                                    @RequestParam("file") MultipartFile file,
                                    @RequestParam String evidenceType,
                                    @RequestParam Long addedBy,
                                    @RequestParam(required = false) String shortDescription) throws Exception {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("file required");
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path dest = storageRoot.resolve(caseId + "_" + System.currentTimeMillis() + "_" + filename);
        Files.copy(file.getInputStream(), dest);
        Evidence e = new Evidence();
        e.setCaseId(caseId);
        e.setAddedBy(addedBy);
        e.setEvidenceType(evidenceType);
        e.setFilePath(dest.toString());
        e.setShortDescription(shortDescription);
        e.setCreatedAt(Instant.now());
        evidenceRepository.save(e);
        return ResponseEntity.ok(e);
    }

    @DeleteMapping("/{evidenceId}")
    public ResponseEntity<?> delete(@PathVariable Long caseId, @PathVariable Long evidenceId) {
        return evidenceRepository.findById(evidenceId).map(e -> {
            evidenceRepository.delete(e);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
