// java
package com.major.crmt.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CasePartyId implements Serializable {
    @Column(name = "case_id")
    private Long caseId;

    @Column(name = "party_id")
    private Long partyId;

    @Column(name = "role_in_case")
    private String roleInCase;

    public CasePartyId() {}

    public CasePartyId(Long caseId, Long partyId, String roleInCase) {
        this.caseId = caseId;
        this.partyId = partyId;
        this.roleInCase = roleInCase;
    }

    // getters/setters, equals/hashCode
    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    public Long getPartyId() { return partyId; }
    public void setPartyId(Long partyId) { this.partyId = partyId; }
    public String getRoleInCase() { return roleInCase; }
    public void setRoleInCase(String roleInCase) { this.roleInCase = roleInCase; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CasePartyId)) return false;
        CasePartyId that = (CasePartyId) o;
        return Objects.equals(caseId, that.caseId) &&
               Objects.equals(partyId, that.partyId) &&
               Objects.equals(roleInCase, that.roleInCase);
    }

    @Override
    public int hashCode() {
        return Objects.hash(caseId, partyId, roleInCase);
    }
}
