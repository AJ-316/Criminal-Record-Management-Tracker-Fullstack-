// java
package com.major.crmt.repositories;

import com.major.crmt.entities.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CaseRepository extends JpaRepository<CaseEntity, Long>, JpaSpecificationExecutor<CaseEntity> {
}
