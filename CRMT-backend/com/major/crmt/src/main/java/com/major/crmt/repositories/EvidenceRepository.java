// java
package com.major.crmt.repositories;

import com.major.crmt.entities.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByCaseId(Long caseId);
}
