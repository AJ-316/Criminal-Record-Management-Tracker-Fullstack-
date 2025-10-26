// java
package com.major.crmt.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "parties")
public class Party {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "party_id")
    private Long partyId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "alias")
    private String alias;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "address")
    private String address;

    @Column(name = "role_in_case", nullable = false)
    private String roleInCase;

    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "created_at")
    private Instant createdAt;

    // getters / setters
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
