package com.blooddonation.service;

import com.blooddonation.dto.AdminCreateDonorRequest;
import com.blooddonation.dto.DonorDto;
import com.blooddonation.exception.ResourceNotFoundException;
import com.blooddonation.model.BloodGroup;
import com.blooddonation.model.Donor;
import com.blooddonation.model.Role;
import com.blooddonation.model.User;
import com.blooddonation.repository.DonorRepository;
import com.blooddonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Donor create(DonorDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (donorRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Donor profile already exists for this user");
        }

        Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(dto.getBloodGroup())
                .age(dto.getAge())
                .phone(dto.getPhone())
                .build();

        return donorRepository.save(donor);
    }

    public Donor createSelf(DonorDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (donorRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalArgumentException("You already have a donor profile");
        }

        Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(dto.getBloodGroup())
                .age(dto.getAge())
                .phone(dto.getPhone())
                .build();

        return donorRepository.save(donor);
    }

    @Transactional
    public Donor adminCreateDonor(AdminCreateDonorRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("A user with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DONOR)
                .build();

        User savedUser = userRepository.save(user);

        Donor donor = Donor.builder()
                .user(savedUser)
                .bloodGroup(request.getBloodGroup())
                .age(request.getAge())
                .phone(request.getPhone())
                .build();

        return donorRepository.save(donor);
    }

    public List<Donor> getAll() {
        return donorRepository.findAll();
    }

    public Donor getById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));
    }

    public Donor getByUserId(Long userId) {
        return donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user id: " + userId));
    }

    public Donor getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return donorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user email: " + email));
    }

    public Donor update(Long id, DonorDto dto) {
        Donor donor = getById(id);
        donor.setBloodGroup(dto.getBloodGroup());
        donor.setAge(dto.getAge());
        donor.setPhone(dto.getPhone());
        return donorRepository.save(donor);
    }

    public void delete(Long id) {
        Donor donor = getById(id);
        donorRepository.delete(donor);
    }

    public List<Donor> getByBloodGroup(BloodGroup bg) {
        return donorRepository.findByBloodGroup(bg);
    }
}
