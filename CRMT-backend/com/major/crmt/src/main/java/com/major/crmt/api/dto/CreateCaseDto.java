// java
package com.major.crmt.api.dto;

import java.time.LocalDate;
import java.util.List;

public class CreateCaseDto {
    private String firId;
    private LocalDate registrationDate;
    private Long jurisdictionId;
    private String description;
    private List<PartyRefDto> parties;
    private String initialStatus;

    // getters/setters
    public String getFirId() { return firId; }
    public void setFirId(String firId) { this.firId = firId; }
    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }
    public Long getJurisdictionId() { return jurisdictionId; }
    public void setJurisdictionId(Long jurisdictionId) { this.jurisdictionId = jurisdictionId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<PartyRefDto> getParties() { return parties; }
    public void setParties(List<PartyRefDto> parties) { this.parties = parties; }
    public String getInitialStatus() { return initialStatus; }
    public void setInitialStatus(String initialStatus) { this.initialStatus = initialStatus; }
}
