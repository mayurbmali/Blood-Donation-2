package com.blooddonation.config;

import com.blooddonation.model.BloodGroup;
import com.blooddonation.model.BloodInventory;
import com.blooddonation.model.Role;
import com.blooddonation.model.User;
import com.blooddonation.repository.BloodInventoryRepository;
import com.blooddonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final BloodInventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        for (BloodGroup group : BloodGroup.values()) {
            if (inventoryRepository.findByBloodGroup(group).isEmpty()) {
                inventoryRepository.save(
                        BloodInventory.builder()
                                .bloodGroup(group)
                                .unitsAvailable(0)
                                .build()
                );
            }
        }

        if (userRepository.findByEmail("admin@bloodbank.com").isEmpty()) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@bloodbank.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("========================================");
            System.out.println("Default admin created:");
            System.out.println("  Email:    admin@bloodbank.com");
            System.out.println("  Password: admin123");
            System.out.println("========================================");
        }
    }
}
