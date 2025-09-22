<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
// UserRepository.java
>>>>>>> Stashed changes
=======
// UserRepository.java
>>>>>>> Stashed changes
package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import org.springframework.stereotype.Repository;

=======
>>>>>>> Stashed changes
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {
    Optional<Users> findByUsername(String username);
<<<<<<< Updated upstream
    Optional<Users> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
=======
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {
    Optional<Users> findByUsername(String username);
}
>>>>>>> Stashed changes
=======
}
>>>>>>> Stashed changes
