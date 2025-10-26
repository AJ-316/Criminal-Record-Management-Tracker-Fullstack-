// java
package com.major.crmt.api.dto;

public class PartyDto {
    private Long partyId;
    private String fullName;
    private String alias;
    private String photoUrl;
    private String nationalId;
    private String address;
    private String roleInCase;
    private Boolean isPublic;

    // getters/setters
    public Long getPartyId() { return partyId; }
    public void setPartyId(Long partyId) { this.partyId = partyId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRoleInCase() { return roleInCase; }
    public void setRoleInCase(String roleInCase) { this.roleInCase = roleInCase; }
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
}
