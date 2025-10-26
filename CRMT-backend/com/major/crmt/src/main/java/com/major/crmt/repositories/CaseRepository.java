// java
package com.major.crmt.repositories;

import com.major.crmt.entities.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CaseRepository extends JpaRepository<CaseEntity, Long>, JpaSpecificationExecutor<CaseEntity> {
	long countByRegistrationDateAfter(java.time.LocalDate date);

	@Query(value = "SELECT c.* FROM cases c JOIN case_parties cp ON cp.case_id = c.case_id WHERE cp.party_id = :partyId", nativeQuery = true)
	java.util.List<CaseEntity> findByPartyId(@Param("partyId") Long partyId);
}
