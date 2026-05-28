package com.blooddonation.controller;

import com.blooddonation.dto.InventoryDto;
import com.blooddonation.model.BloodInventory;
import com.blooddonation.service.BloodInventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final BloodInventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodInventory> update(@Valid @RequestBody InventoryDto dto) {
        return ResponseEntity.ok(inventoryService.update(dto));
    }
}
