package com.blooddonation.repository;

import com.blooddonation.model.BloodGroup;
import com.blooddonation.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUserId(Long userId);
    List<Donor> findByBloodGroup(BloodGroup bloodGroup);
}
