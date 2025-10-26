package com.major.crmt.api.dto;

import com.major.crmt.entities.CaseStatus;
import com.major.crmt.entities.Party;
import java.time.LocalDate;
import java.util.List;

public class CaseDetailsDto {
    private Long caseId;
    private String firId;
    private LocalDate registrationDate;
    private Long jurisdictionId;
    private String description;
    private String currentStatus;
    private List<PartyRefDto> parties;
    private String jurisdictionName;

    // Constructor with essential fields
    public CaseDetailsDto(Long caseId, String firId, LocalDate registrationDate, Long jurisdictionId, 
                         String description, String currentStatus) {
        this.caseId = caseId;
        this.firId = firId;
        this.registrationDate = registrationDate;
        this.jurisdictionId = jurisdictionId;
        this.description = description;
        this.currentStatus = currentStatus;
    }

    // Getters and setters
    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    
    public String getFirId() { return firId; }
    public void setFirId(String firId) { this.firId = firId; }
    
    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }
    
    public Long getJurisdictionId() { return jurisdictionId; }
    public void setJurisdictionId(Long jurisdictionId) { this.jurisdictionId = jurisdictionId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
    
    public List<PartyRefDto> getParties() { return parties; }
    public void setParties(List<PartyRefDto> parties) { this.parties = parties; }
    
    public String getJurisdictionName() { return jurisdictionName; }
    public void setJurisdictionName(String jurisdictionName) { this.jurisdictionName = jurisdictionName; }
}