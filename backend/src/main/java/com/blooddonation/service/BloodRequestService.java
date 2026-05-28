package com.blooddonation.service;

import com.blooddonation.dto.BloodRequestDto;
import com.blooddonation.exception.ResourceNotFoundException;
import com.blooddonation.model.BloodRequest;
import com.blooddonation.model.RequestStatus;
import com.blooddonation.model.User;
import com.blooddonation.repository.BloodRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final BloodInventoryService inventoryService;

    public BloodRequest create(BloodRequestDto dto, User requester) {
        BloodRequest request = BloodRequest.builder()
                .requesterName(requester.getName())
                .requester(requester)
                .bloodGroup(dto.getBloodGroup())
                .units(dto.getUnits())
                .status(RequestStatus.PENDING)
                .build();
        return requestRepository.save(request);
    }

    public List<BloodRequest> getAll() {
        return requestRepository.findByOrderByCreatedAtDesc();
    }

    public List<BloodRequest> getByRequester(User requester) {
        return requestRepository.findByRequesterOrderByCreatedAtDesc(requester);
    }

    @Transactional
    public BloodRequest updateStatus(Long id, RequestStatus status) {
        BloodRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + id));

        if (status == RequestStatus.APPROVED && request.getStatus() != RequestStatus.APPROVED) {
            inventoryService.decreaseStock(request.getBloodGroup(), request.getUnits());
        }

        if (request.getStatus() == RequestStatus.APPROVED && status != RequestStatus.APPROVED) {
            inventoryService.increaseStock(request.getBloodGroup(), request.getUnits());
        }

        request.setStatus(status);
        return requestRepository.save(request);
    }

    @Transactional
    public void delete(Long id) {
        BloodRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + id));

        if (request.getStatus() == RequestStatus.APPROVED) {
            inventoryService.increaseStock(request.getBloodGroup(), request.getUnits());
        }

        requestRepository.delete(request);
    }
}
