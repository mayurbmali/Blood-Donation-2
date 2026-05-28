package com.blooddonation.controller;

import com.blooddonation.dto.DonationDto;
import com.blooddonation.model.DonationHistory;
import com.blooddonation.service.DonationHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "*")
public class DonationHistoryController {

    private final DonationHistoryService donationService;

    @GetMapping
    public ResponseEntity<List<DonationHistory>> getAll() {
        return ResponseEntity.ok(donationService.getAll());
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationHistory>> getByDonor(@PathVariable Long donorId) {
        return ResponseEntity.ok(donationService.getByDonor(donorId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DonationHistory> add(@Valid @RequestBody DonationDto dto) {
        return new ResponseEntity<>(donationService.add(dto), HttpStatus.CREATED);
    }
}
