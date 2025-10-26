package com.major.crmt.repositories;

import com.major.crmt.entities.Jurisdiction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JurisdictionRepository extends JpaRepository<Jurisdiction, Long> {
}