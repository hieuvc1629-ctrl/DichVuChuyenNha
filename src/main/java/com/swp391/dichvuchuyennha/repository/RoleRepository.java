package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import org.springframework.stereotype.Repository;
=======
>>>>>>> Stashed changes

public interface RoleRepository extends JpaRepository<Roles, Integer> {
<<<<<<< Updated upstream
    Optional<Roles> findByRoleId(Integer roleId);
    Optional<Roles> findByRoleName(String roleName);
=======

public interface RoleRepository extends JpaRepository<Roles, Integer> {
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
