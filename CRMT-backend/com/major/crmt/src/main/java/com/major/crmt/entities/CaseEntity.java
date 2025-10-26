// java
package com.major.crmt.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cases")
public class CaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "fir_id", unique = true)
    private String firId;

    @Column(name = "reg_date", nullable = true)
    private LocalDate registrationDate = LocalDate.now();

    @Column(name = "jurisdiction_id")
    private Long jurisdictionId;

    @Column(name = "description")
    private String description;

    // getters/setters
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
}
