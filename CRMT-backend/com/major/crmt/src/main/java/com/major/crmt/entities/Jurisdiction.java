package com.major.crmt.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "jurisdictions")
public class Jurisdiction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jurisdiction_id")
    private Long jurisdictionId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private JurisdictionType type;
    
    @Column(name = "level")
    @Enumerated(EnumType.STRING)
    private JurisdictionLevel level = JurisdictionLevel.local;
    
    @Column(name = "address")
    private String address;
    
    public enum JurisdictionType {
        police_station, court
    }
    
    public enum JurisdictionLevel {
        local, district, state, high_court, supreme_court
    }
}