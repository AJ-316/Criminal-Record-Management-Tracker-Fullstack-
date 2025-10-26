// java
package com.major.crmt.services;

import com.major.crmt.entities.*;
import com.major.crmt.repositories.*;
import com.major.crmt.api.dto.CreateCaseDto;
import com.major.crmt.api.dto.PartyRefDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class CaseService {
    private final CaseRepository caseRepository;
    private final PartyRepository partyRepository;
    private final CasePartyRepository casePartyRepository;
    private final CaseStatusRepository caseStatusRepository;

    public CaseService(CaseRepository caseRepository,
                       PartyRepository partyRepository,
                       CasePartyRepository casePartyRepository,
                       CaseStatusRepository caseStatusRepository) {
        this.caseRepository = caseRepository;
        this.partyRepository = partyRepository;
        this.casePartyRepository = casePartyRepository;
        this.caseStatusRepository = caseStatusRepository;
    }

    @Transactional
    public CaseEntity createCase(CreateCaseDto dto, Long creatorUserId) {
        CaseEntity c = new CaseEntity();
        c.setFirId(dto.getFirId());
        c.setRegistrationDate(dto.getRegistrationDate());
        c.setJurisdictionId(dto.getJurisdictionId());
        c.setDescription(dto.getDescription());
        CaseEntity saved = caseRepository.save(c);

        // link parties
        if (dto.getParties() != null) {
            for (PartyRefDto pr : dto.getParties()) {
                Party party;
                if (pr.getPartyId() != null) {
                    party = partyRepository.findById(pr.getPartyId()).orElseThrow(() -> new RuntimeException("Party not found"));
                } else {
                    party = new Party();
                    party.setFullName(pr.getParty().getFullName());
                    party.setAlias(pr.getParty().getAlias());
                    party.setAddress(pr.getParty().getAddress());
                    party.setNationalId(pr.getParty().getNationalId());
                    party.setPhotoUrl(pr.getParty().getPhotoUrl());
                    party.setRoleInCase(pr.getRoleInCase());
                    party = partyRepository.save(party);
                }
                CaseParty cp = new CaseParty(new CasePartyId(saved.getCaseId(), party.getPartyId(), pr.getRoleInCase()));
                casePartyRepository.save(cp);
            }
        }

        // initial status
        if (dto.getInitialStatus() != null) {
            CaseStatus cs = new CaseStatus();
            cs.setCaseId(saved.getCaseId());
            cs.setStatus(dto.getInitialStatus());
            cs.setUpdatedBy(creatorUserId);
            cs.setUpdatedAt(Instant.now());
            caseStatusRepository.save(cs);
        }

        return saved;
    }
}
