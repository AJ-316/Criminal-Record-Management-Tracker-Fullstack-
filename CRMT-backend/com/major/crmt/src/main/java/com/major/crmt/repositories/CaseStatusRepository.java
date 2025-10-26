// java
package com.major.crmt.repositories;

import com.major.crmt.entities.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseStatusRepository extends JpaRepository<CaseStatus, Long> {
    List<CaseStatus> findByCaseIdOrderByUpdatedAtDesc(Long caseId);
    java.util.Optional<CaseStatus> findFirstByCaseIdOrderByUpdatedAtDesc(Long caseId);
}
