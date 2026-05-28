package com.blooddonation.service;

import com.blooddonation.dto.InventoryDto;
import com.blooddonation.exception.ResourceNotFoundException;
import com.blooddonation.model.BloodGroup;
import com.blooddonation.model.BloodInventory;
import com.blooddonation.repository.BloodInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodInventoryService {

    private final BloodInventoryRepository inventoryRepository;

    public List<BloodInventory> getAll() {
        return inventoryRepository.findAll();
    }

    public BloodInventory update(InventoryDto dto) {
        BloodInventory inventory = inventoryRepository.findByBloodGroup(dto.getBloodGroup())
                .orElseGet(() -> BloodInventory.builder()
                        .bloodGroup(dto.getBloodGroup())
                        .unitsAvailable(0)
                        .build());
        
        inventory.setUnitsAvailable(dto.getUnitsAvailable());
        return inventoryRepository.save(inventory);
    }

    public void decreaseStock(BloodGroup bloodGroup, Integer units) {
        BloodInventory inventory = inventoryRepository.findByBloodGroup(bloodGroup)
                .orElseThrow(() -> new ResourceNotFoundException("Blood inventory not found for group: " + bloodGroup));

        if (inventory.getUnitsAvailable() < units) {
            throw new IllegalArgumentException("Insufficient blood stock for group: " + bloodGroup);
        }

        inventory.setUnitsAvailable(inventory.getUnitsAvailable() - units);
        inventoryRepository.save(inventory);
    }

    public void increaseStock(BloodGroup bloodGroup, Integer units) {
        BloodInventory inventory = inventoryRepository.findByBloodGroup(bloodGroup)
                .orElseGet(() -> BloodInventory.builder()
                        .bloodGroup(bloodGroup)
                        .unitsAvailable(0)
                        .build());

        inventory.setUnitsAvailable(inventory.getUnitsAvailable() + units);
        inventoryRepository.save(inventory);
    }
}
