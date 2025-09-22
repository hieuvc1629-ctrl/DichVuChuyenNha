package com.swp391.dichvuchuyennha.repository;

import com.swp391.dichvuchuyennha.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Integer> {
    Optional<Roles> findByRoleId(Integer roleId);
    Optional<Roles> findByRoleName(String roleName);
}
