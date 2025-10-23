package com.pawtrack.PawTrack.controller;

import com.pawtrack.PawTrack.model.Donation;
import com.pawtrack.PawTrack.repo.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/donations")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow React frontend
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    // ✅ Create / Save a new donation
    @PostMapping
    public ResponseEntity<Donation> saveDonation(@RequestBody Donation donation) {
        try {
            Donation savedDonation = donationRepository.save(donation);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDonation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Get all donations
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        List<Donation> donations = donationRepository.findAll();
        return ResponseEntity.ok(donations);
    }

    // ✅ Get donation by ID (optional but helpful for follow-ups)
    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        Optional<Donation> donation = donationRepository.findById(id);
        return donation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Delete donation by ID (optional for admin panel)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        if (donationRepository.existsById(id)) {
            donationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
