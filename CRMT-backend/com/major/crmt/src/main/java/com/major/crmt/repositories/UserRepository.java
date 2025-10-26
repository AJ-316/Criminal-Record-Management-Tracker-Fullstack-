// java
// File: src/main/java/com/major/crmt/repositories/UserRepository.java
package com.major.crmt.repositories;

import com.major.crmt.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
}
