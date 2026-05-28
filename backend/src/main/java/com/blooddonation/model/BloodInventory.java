package com.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, unique = true)
    private BloodGroup bloodGroup;

    @Column(name = "units_available", nullable = false)
    private Integer unitsAvailable;
}
