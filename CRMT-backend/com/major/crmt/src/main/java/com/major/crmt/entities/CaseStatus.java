// java
package com.major.crmt.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "case_status")
public class CaseStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Long statusId;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "updated_by", nullable = false)
    private Long updatedBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    // getters/setters
    public Long getStatusId() { return statusId; }
    public void setStatusId(Long statusId) { this.statusId = statusId; }
    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
