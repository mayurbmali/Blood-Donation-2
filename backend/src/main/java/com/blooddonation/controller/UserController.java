package com.blooddonation.controller;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;
import com.blooddonation.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/without-donor-profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersWithoutDonorProfile() {
        List<User> allUsers = userRepository.findAll();
        List<User> usersWithoutProfile = allUsers.stream()
                .filter(user -> donorRepository.findByUserId(user.getId()).isEmpty())
                .collect(Collectors.toList());
        return ResponseEntity.ok(usersWithoutProfile);
    }
}
