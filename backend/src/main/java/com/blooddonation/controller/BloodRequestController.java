package com.blooddonation.controller;

import com.blooddonation.dto.BloodRequestDto;
import com.blooddonation.model.BloodRequest;
import com.blooddonation.model.RequestStatus;
import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;
import com.blooddonation.service.BloodRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BloodRequestController {

    private final BloodRequestService requestService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodRequest>> getAll() {
        return ResponseEntity.ok(requestService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<BloodRequest>> getMyRequests(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(requestService.getByRequester(user));
    }

    @PostMapping
    public ResponseEntity<BloodRequest> create(
            @Valid @RequestBody BloodRequestDto dto,
            Principal principal
    ) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new ResponseEntity<>(requestService.create(dto, user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status
    ) {
        return ResponseEntity.ok(requestService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        requestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
