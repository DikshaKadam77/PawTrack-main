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
    public ResponseEntity<?> saveDonation(@RequestBody Donation donation) {
        try {
            Donation savedDonation = donationRepository.save(donation);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDonation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save donation: " + e.getMessage());
        }
    }

    // ✅ Get all donations
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        try {
            List<Donation> donations = donationRepository.findAll();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonationById(@PathVariable Long id) {
        try {
            Optional<Donation> donation = donationRepository.findById(id);
            if (donation.isPresent()) {
                return ResponseEntity.ok(donation.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Donation not found with ID: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving donation: " + e.getMessage());
        }
    }

    // ✅ Delete donation by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long id) {
        try {
            if (donationRepository.existsById(id)) {
                donationRepository.deleteById(id);
                return ResponseEntity.ok("Donation deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Donation not found with ID: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting donation: " + e.getMessage());
        }
    }
}
