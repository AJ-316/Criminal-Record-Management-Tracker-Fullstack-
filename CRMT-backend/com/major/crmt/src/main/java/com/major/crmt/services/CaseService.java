// java
package com.major.crmt.services;

import com.major.crmt.api.dto.PartyDto;
import com.major.crmt.entities.*;
import com.major.crmt.repositories.*;
import com.major.crmt.api.dto.CaseDetailsDto;
import com.major.crmt.api.dto.CreateCaseDto;
import com.major.crmt.api.dto.PartyRefDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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

    @Transactional(readOnly = true)
    public CaseDetailsDto getCaseDetails(Long caseId) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        // Get current status
        List<CaseStatus> statuses = caseStatusRepository.findByCaseIdOrderByUpdatedAtDesc(caseId);
        String currentStatus = statuses.isEmpty() ? "fir_filed" : statuses.get(0).getStatus();

        CaseDetailsDto dto = new CaseDetailsDto(
            caseEntity.getCaseId(),
            caseEntity.getFirId(),
            caseEntity.getRegistrationDate(),
            caseEntity.getJurisdictionId(),
            caseEntity.getDescription(),
            currentStatus
        );

        // Get parties
        List<CaseParty> caseParties = casePartyRepository.findByIdCaseId(caseId);
        List<PartyRefDto> parties = new ArrayList<>();
        for (CaseParty cp : caseParties) {
            PartyRefDto ref = new PartyRefDto();
            ref.setPartyId(cp.getCasePartyId().getPartyId());
            ref.setRoleInCase(cp.getCasePartyId().getRoleInCase());
            // Get party details
            Party party = partyRepository.findById(cp.getCasePartyId().getPartyId())
                    .orElse(null);
            if (party != null) {
                PartyDto partyDto = new PartyDto();
                partyDto.setFullName(party.getFullName());
                partyDto.setAlias(party.getAlias());
                partyDto.setAddress(party.getAddress());
                partyDto.setNationalId(party.getNationalId());
                partyDto.setPhotoUrl(party.getPhotoUrl());
                ref.setParty(partyDto);
            }
            parties.add(ref);
        }
        dto.setParties(parties);

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<CaseDetailsDto> listCases(Long jurisdictionId, Pageable pageable) {
        Page<CaseEntity> cases;
        if (jurisdictionId != null) {
            cases = caseRepository.findAll(
                (root, cq, cb) -> cb.equal(root.get("jurisdictionId"), jurisdictionId), 
                pageable
            );
        } else {
            cases = caseRepository.findAll(pageable);
        }

        return cases.map(caseEntity -> {
            List<CaseStatus> statuses = caseStatusRepository.findByCaseIdOrderByUpdatedAtDesc(caseEntity.getCaseId());
            String currentStatus = statuses.isEmpty() ? "fir_filed" : statuses.get(0).getStatus();

            CaseDetailsDto dto = new CaseDetailsDto(
                caseEntity.getCaseId(),
                caseEntity.getFirId(),
                caseEntity.getRegistrationDate(),
                caseEntity.getJurisdictionId(),
                caseEntity.getDescription(),
                currentStatus
            );

            // Get parties for each case
            List<CaseParty> caseParties = casePartyRepository.findByIdCaseId(caseEntity.getCaseId());
            List<PartyRefDto> parties = new ArrayList<>();
            for (CaseParty cp : caseParties) {
                PartyRefDto ref = new PartyRefDto();
                ref.setPartyId(cp.getCasePartyId().getPartyId());
                ref.setRoleInCase(cp.getCasePartyId().getRoleInCase());
                // Get party details
                Party party = partyRepository.findById(cp.getCasePartyId().getPartyId())
                        .orElse(null);
                if (party != null) {
                    PartyDto partyDto = new PartyDto();
                    partyDto.setFullName(party.getFullName());
                    partyDto.setAlias(party.getAlias());
                    partyDto.setAddress(party.getAddress());
                    partyDto.setNationalId(party.getNationalId());
                    partyDto.setPhotoUrl(party.getPhotoUrl());
                    ref.setParty(partyDto);
                }
                parties.add(ref);
            }
            dto.setParties(parties);

            return dto;
        });
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
                    party.setIsPublic(true); // Set default value
                    party.setCreatedAt(java.time.Instant.now()); // Set creation timestamp
                    party = partyRepository.save(party);
                }
                CaseParty cp = new CaseParty(new CasePartyId(saved.getCaseId(), party.getPartyId(), pr.getRoleInCase()));
                casePartyRepository.save(cp);
            }
        }

        // Always set initial status
        CaseStatus cs = new CaseStatus();
        cs.setCaseId(saved.getCaseId());
        cs.setStatus(dto.getInitialStatus() != null ? dto.getInitialStatus() : "fir_filed");
        cs.setUpdatedBy(creatorUserId);
        cs.setUpdatedAt(Instant.now());
        caseStatusRepository.save(cs);

        return saved;
    }
}
