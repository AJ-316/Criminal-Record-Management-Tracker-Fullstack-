package com.major.crmt.api;

import com.major.crmt.api.dto.SummaryDto;
import com.major.crmt.repositories.CaseRepository;
import com.major.crmt.repositories.EvidenceRepository;
import com.major.crmt.repositories.PartyRepository;
import com.major.crmt.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final PartyRepository partyRepository;
    private final EvidenceRepository evidenceRepository;

    public AdminController(UserRepository userRepository, CaseRepository caseRepository, PartyRepository partyRepository, EvidenceRepository evidenceRepository) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.partyRepository = partyRepository;
        this.evidenceRepository = evidenceRepository;
    }

    @GetMapping("/summary")
    public SummaryDto summary() {
        SummaryDto dto = new SummaryDto();
        long totalUsers = userRepository.count();
        dto.setTotalUsers(totalUsers);
        Map<String, Long> usersByRole = new HashMap<>();
        String[] roles = new String[] {"admin","police","investigator","lawyer","judge","civilian"};
        for (String r : roles) usersByRole.put(r, userRepository.countByRole(r));
        dto.setUsersByRole(usersByRole);

        long totalCases = caseRepository.count();
        dto.setTotalCases(totalCases);
        // recent cases in last 30 days
        long recent = caseRepository.countByRegistrationDateAfter(LocalDate.now().minusDays(30));
        dto.setRecentCases(recent);

        dto.setTotalParties(partyRepository.count());
        dto.setTotalEvidence(evidenceRepository.count());

        return dto;
    }
}
