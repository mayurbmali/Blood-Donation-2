package com.blooddonation.service;

import com.blooddonation.dto.DonationDto;
import com.blooddonation.exception.ResourceNotFoundException;
import com.blooddonation.model.DonationHistory;
import com.blooddonation.model.Donor;
import com.blooddonation.repository.DonationHistoryRepository;
import com.blooddonation.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationHistoryService {

    private final DonationHistoryRepository donationHistoryRepository;
    private final DonorRepository donorRepository;
    private final BloodInventoryService inventoryService;

    private static final int MINIMUM_DAYS_BETWEEN_DONATIONS = 56;

    @Transactional
    public DonationHistory add(DonationDto dto) {
        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + dto.getDonorId()));

        if (donor.getLastDonationDate() != null) {
            long daysSinceLast = java.time.temporal.ChronoUnit.DAYS.between(donor.getLastDonationDate(), dto.getDonationDate());
            if (daysSinceLast < MINIMUM_DAYS_BETWEEN_DONATIONS) {
                long daysRemaining = MINIMUM_DAYS_BETWEEN_DONATIONS - daysSinceLast;
                throw new IllegalArgumentException(
                    "Donor " + donor.getUser().getName() + " must wait " + daysRemaining +
                    " more day(s) before donating again (minimum 56 days between donations)."
                );
            }
        }

        DonationHistory donation = DonationHistory.builder()
                .donor(donor)
                .unitsDonated(dto.getUnitsDonated())
                .donationDate(dto.getDonationDate())
                .bloodGroupAtDonation(donor.getBloodGroup())
                .build();

        if (donor.getLastDonationDate() == null || dto.getDonationDate().isAfter(donor.getLastDonationDate())) {
            donor.setLastDonationDate(dto.getDonationDate());
            donorRepository.save(donor);
        }

        inventoryService.increaseStock(donor.getBloodGroup(), dto.getUnitsDonated());

        return donationHistoryRepository.save(donation);
    }

    public List<DonationHistory> getByDonor(Long donorId) {
        return donationHistoryRepository.findByDonorId(donorId);
    }

    public List<DonationHistory> getAll() {
        return donationHistoryRepository.findAll();
    }
}
