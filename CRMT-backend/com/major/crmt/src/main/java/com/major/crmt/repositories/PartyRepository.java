// java
package com.major.crmt.repositories;

import com.major.crmt.entities.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartyRepository extends JpaRepository<Party, Long> {
    Page<Party> findByRoleInCase(String roleInCase, Pageable pageable);
    Page<Party> findByFullNameContainingIgnoreCase(String query, Pageable pageable);
}
