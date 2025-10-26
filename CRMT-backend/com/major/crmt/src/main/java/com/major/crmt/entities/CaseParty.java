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

    public CasePartyId getId() { return id; }
    public void setId(CasePartyId id) { this.id = id; }
}
