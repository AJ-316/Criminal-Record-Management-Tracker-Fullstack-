// java
package com.major.crmt.repositories;

import com.major.crmt.entities.CaseParty;
import com.major.crmt.entities.CasePartyId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CasePartyRepository extends JpaRepository<CaseParty, CasePartyId> {
    List<CaseParty> findByIdCaseId(Long caseId);
}
