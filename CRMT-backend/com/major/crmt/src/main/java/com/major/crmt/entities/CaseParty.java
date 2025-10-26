// java
package com.major.crmt.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "case_parties")
public class CaseParty {
    @EmbeddedId
    private CasePartyId id;

    public CaseParty() {}
    public CaseParty(CasePartyId id) { this.id = id; }

    public CasePartyId getCasePartyId() { return id; }
    public void setCasePartyId(CasePartyId id) { this.id = id; }
}
