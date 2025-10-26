// java
package com.major.crmt.api.dto;

public class PartyRefDto {
    private Long partyId;
    private PartyDto party;
    private String roleInCase;

    // getters/setters
    public Long getPartyId() { return partyId; }
    public void setPartyId(Long partyId) { this.partyId = partyId; }
    public PartyDto getParty() { return party; }
    public void setParty(PartyDto party) { this.party = party; }
    public String getRoleInCase() { return roleInCase; }
    public void setRoleInCase(String roleInCase) { this.roleInCase = roleInCase; }
}
